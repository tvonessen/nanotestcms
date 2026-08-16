#!/usr/bin/bash
set -euo pipefail

DEST="${DEST:-live}"
STAGE="${DEST}.new"
DATA_DIR="${DATA_DIR:-${DEST}.data}"
LOG_DIR="${LOG_DIR:-logs}"
LOG_FILE="${LOG_DIR}/deploy.log"
HEALTH_CHECK_TIMEOUT="${HEALTH_CHECK_TIMEOUT:-90}"
DEPLOY_COMMIT_SHA="${DEPLOY_COMMIT_SHA:-}"

timestamp() {
  date '+%Y-%m-%dT%H:%M:%S%:z'
}

log() {
  mkdir -p "$LOG_DIR"
  printf '[%s] %s\n' "$(timestamp)" "$*" | tee -a "$LOG_FILE"
}

# The runtime port is fixed on this server — no dynamic resolution/autodetect.
RUNTIME_PORT="${PORT:-3000}"

pid_on_port() {
  local port="$1" pid

  # Method 1: lsof (most common, but may not be installed on shared hosting).
  if command -v lsof >/dev/null 2>&1; then
    pid="$(lsof -ti "tcp:${port}" -sTCP:LISTEN 2>/dev/null | head -n1)"
    [[ -n "$pid" ]] && { printf '%s\n' "$pid"; return 0; }
  fi

  # Method 2: fuser (often available where lsof isn't).
  if command -v fuser >/dev/null 2>&1; then
    pid="$(fuser -n tcp "$port" 2>/dev/null | tr -s ' ' '\n' | grep -E '^[0-9]+$' | head -n1)"
    [[ -n "$pid" ]] && { printf '%s\n' "$pid"; return 0; }
  fi

  # Method 3: pure /proc parsing (Linux-only, no external tool required).
  # /proc/net/tcp lists sockets as "local_address" (hex IP:PORT) plus an
  # inode; matching PIDs are found by resolving /proc/<pid>/fd/* symlinks
  # that point at "socket:[<inode>]". Works as long as the deploying user
  # owns the target process (true here — same app user).
  if [[ -r /proc/net/tcp ]]; then
    local hex_port inode candidate fd
    hex_port="$(printf '%04X' "$port")"
    inode="$(awk -v hp=":${hex_port}" '
      $2 ~ hp"$" && $4 == "0A" { print $10; exit }
    ' /proc/net/tcp 2>/dev/null)"
    if [[ -n "$inode" ]]; then
      for candidate in /proc/[0-9]*; do
        [[ -d "$candidate/fd" ]] || continue
        for fd in "$candidate"/fd/*; do
          if [[ "$(readlink "$fd" 2>/dev/null)" == "socket:[${inode}]" ]]; then
            printf '%s\n' "${candidate#/proc/}"
            return 0
          fi
        done
      done
    fi
  fi

  return 1
}

resolve_path() {
  local input="$1"
  if command -v realpath >/dev/null 2>&1; then
    realpath -m "$input"
    return 0
  fi

  if [[ "$input" = /* ]]; then
    printf '%s\n' "$input"
  else
    printf '%s/%s\n' "$PWD" "${input#./}"
  fi
}

ensure_data_dir_safe() {
  local dest_abs stage_abs data_abs
  dest_abs="$(resolve_path "$DEST")"
  stage_abs="$(resolve_path "$STAGE")"
  data_abs="$(resolve_path "$DATA_DIR")"

  if [[ "$data_abs/" == "$dest_abs/"* ]] || [[ "$data_abs/" == "$stage_abs/"* ]]; then
    log "ERROR: DATA_DIR (${DATA_DIR}) darf nicht innerhalb von ${DEST} oder ${STAGE} liegen."
    exit 1
  fi
}

backup_data_dir() {
  if [[ ! -d "$DATA_DIR" ]]; then
    return 0
  fi

  local backup_file data_parent data_name
  backup_file="${LOG_DIR}/data-backup.tar.gz"
  data_parent="$(dirname "$DATA_DIR")"
  data_name="$(basename "$DATA_DIR")"

  mkdir -p "$LOG_DIR"
  tar -C "$data_parent" -czf "$backup_file" "$data_name"
  log "Backup von ${DATA_DIR} erstellt: ${backup_file}"
}

validate_data_dir() {
  local data_link_real data_real

  if [[ ! -d "$DATA_DIR" ]]; then
    log "ERROR: Persistenter Datenordner fehlt: ${DATA_DIR}"
    exit 1
  fi

  mkdir -p "$DATA_DIR/media" "$DATA_DIR/documents"

  if ! touch "$DATA_DIR/.deploy-write-test" 2>/dev/null; then
    log "ERROR: Persistenter Datenordner ist nicht beschreibbar: ${DATA_DIR}"
    exit 1
  fi
  rm -f "$DATA_DIR/.deploy-write-test"

  if ! touch "$DATA_DIR/media/.deploy-write-test" 2>/dev/null; then
    log "ERROR: ${DATA_DIR}/media ist nicht beschreibbar."
    exit 1
  fi
  rm -f "$DATA_DIR/media/.deploy-write-test"

  if ! touch "$DATA_DIR/documents/.deploy-write-test" 2>/dev/null; then
    log "ERROR: ${DATA_DIR}/documents ist nicht beschreibbar."
    exit 1
  fi
  rm -f "$DATA_DIR/documents/.deploy-write-test"

  if [[ -L "$STAGE/data" ]]; then
    data_link_real="$(readlink -f "$STAGE/data")"
  else
    data_link_real="$(resolve_path "$STAGE/data")"
  fi
  data_real="$(readlink -f "$DATA_DIR")"
  if [[ "$data_link_real" != "$data_real" ]]; then
    log "ERROR: Daten-Symlink ${STAGE}/data verweist auf ${data_link_real}, erwartet ${data_real}."
    exit 1
  fi
}

cleanup() {
  rm -rf "$STAGE"
}

trap cleanup EXIT

log "Deploy gestartet."
ensure_data_dir_safe

if [[ -z "$DEPLOY_COMMIT_SHA" ]]; then
  DEPLOY_COMMIT_SHA="$(git rev-parse HEAD 2>/dev/null || true)"
fi
if [[ -z "$DEPLOY_COMMIT_SHA" ]]; then
  DEPLOY_COMMIT_SHA="unknown"
fi
log "Deploy-Commit: ${DEPLOY_COMMIT_SHA}"

rm -rf "${DEST}.prev" "${DEST}.failed"
rm -rf "$STAGE"
mkdir -p "$STAGE/.next"

cp -a .next/standalone/. "$STAGE"
cp -a .next/static "$STAGE/.next/static"
cp -a public "$STAGE/public"

# Next.js's standalone output relies on @vercel/nft file-tracing to build a
# minimal node_modules. That tracing is known to be unreliable with pnpm's
# content-addressed .pnpm virtual store — it can produce incomplete copies
# for nested/peer-dep-hashed packages (observed in production as "Cannot find
# module '.../node_modules/.pnpm/next@.../node_modules/...'" at *runtime*
# even though the build itself succeeded). Instead of trusting the traced
# node_modules, install a real production-only node_modules directly into the
# stage directory using the exact same lockfile/workspace config (so
# overrides like the dompurify CVE fix and native-build allowlisting for
# sharp still apply). This reuses the local pnpm content-addressable store,
# so it's fast (no re-download) and much smaller than copying the full
# dev node_modules (verified: ~1.1G prod-only vs ~1.8G full dev tree).
rm -rf "$STAGE/node_modules"
cp package.json pnpm-lock.yaml pnpm-workspace.yaml "$STAGE/"
[[ -f .npmrc ]] && cp .npmrc "$STAGE/.npmrc"
mkdir -p "$LOG_DIR"
stage_install_log="$(resolve_path "${LOG_DIR}/stage-install.log")"
if ! (cd "$STAGE" && CI=true pnpm install --prod --frozen-lockfile --offline >"$stage_install_log" 2>&1); then
  log "ERROR: pnpm install --prod im Stage-Verzeichnis fehlgeschlagen."
  tail -n 20 "$stage_install_log" | sed 's/^/  /' | tee -a "$LOG_FILE"
  exit 1
fi
log "Produktions-Abhaengigkeiten im Stage-Verzeichnis installiert."

if [[ ! -d "$DATA_DIR" ]]; then
  if [[ -d "$DEST/data" ]]; then
    mkdir -p "$(dirname "$DATA_DIR")"
    mv "$DEST/data" "$DATA_DIR"
    log "Bestehende Daten aus ${DEST}/data nach ${DATA_DIR} migriert."
  elif [[ -d "data" ]]; then
    mkdir -p "$(dirname "$DATA_DIR")"
    cp -a data "$DATA_DIR"
    log "Initiale Daten aus ./data nach ${DATA_DIR} kopiert."
  else
    mkdir -p "$DATA_DIR"
    log "Neues persistentes Datenverzeichnis ${DATA_DIR} erstellt."
  fi
fi

backup_data_dir

mkdir -p "$DATA_DIR/media" "$DATA_DIR/documents"
if [[ "$DATA_DIR" = /* ]]; then
  data_link_target="$DATA_DIR"
else
  data_link_target="../$DATA_DIR"
fi
ln -sfn "$data_link_target" "$STAGE/data"
log "Release-Datenpfad ${STAGE}/data auf ${DATA_DIR} verlinkt."
validate_data_dir

cp .env "$STAGE/.env"
printf '%s\n' "$DEPLOY_COMMIT_SHA" > "$STAGE/COMMIT_SHA"

# Atomic swap: keep old release as rollback
if [[ -d "$DEST" ]]; then
  mv "$DEST" "${DEST}.prev"
  log "Vorherige Version als ${DEST}.prev gesichert."
fi
if ! mv "$STAGE" "$DEST"; then
  if [[ -d "${DEST}.prev" ]] && [[ ! -d "$DEST" ]]; then
    mv "${DEST}.prev" "$DEST"
    log "ERROR: Swap fehlgeschlagen — Vorversion wiederhergestellt."
  fi
  exit 1
fi
log "Neues Release aktiviert."

# Make sure the port is actually free before (re)starting: mittnitectl's
# restart has been observed to not reliably terminate the previous process,
# leaving the port occupied so the new process fails to start. Kill whatever
# is bound to the fixed runtime port directly instead of relying on
# mittnitectl to do it.
old_pid="$(pid_on_port "$RUNTIME_PORT" || true)"
if [[ -n "$old_pid" ]]; then
  log "Beende vorherigen Prozess auf Port ${RUNTIME_PORT} (PID ${old_pid})."
  kill -TERM "$old_pid" 2>/dev/null || true
  for _ in 1 2 3 4 5; do
    kill -0 "$old_pid" 2>/dev/null || break
    sleep 1
  done
  if kill -0 "$old_pid" 2>/dev/null; then
    kill -KILL "$old_pid" 2>/dev/null || true
    log "SIGKILL an PID ${old_pid} gesendet (reagierte nicht auf SIGTERM)."
  fi
  if kill -0 "$old_pid" 2>/dev/null; then
    log "WARNUNG: PID ${old_pid} antwortet auch nach SIGKILL noch auf kill -0 (evtl. Zombie oder fehlende Berechtigung)."
  fi
else
  log "Kein Prozess auf Port ${RUNTIME_PORT} gefunden (bereits frei, oder Erkennung ueber lsof/fuser/proc fehlgeschlagen)."
fi

# Restart via mittnitectl (Mittwald's mittnite process supervisor)
if command -v mittnitectl >/dev/null 2>&1; then
  if ! mittnitectl job restart 2>/dev/null; then
    log "Kein laufender Job — versuche Start..."
    mittnitectl job start
  fi
  log "Prozess-Neustart via mittnitectl ausgelöst."
else
  log "WARNUNG: mittnitectl nicht gefunden."
fi

# HTTP health check
if ! command -v curl >/dev/null 2>&1; then
  log "WARNUNG: curl nicht verfügbar — kein Health-Check möglich."
  log "Deploy abgeschlossen (nicht verifiziert)."
  exit 0
fi

log "Warte auf Server-Antwort (Port ${RUNTIME_PORT}, Timeout ${HEALTH_CHECK_TIMEOUT}s)..."
deadline=$(( $(date +%s) + HEALTH_CHECK_TIMEOUT ))
while true; do
  if curl -sf --max-time 3 "http://localhost:${RUNTIME_PORT}/" >/dev/null 2>&1; then
    rm -rf "${DEST}.prev"
    log "Server antwortet auf Port ${RUNTIME_PORT}. Deploy erfolgreich abgeschlossen (Commit: ${DEPLOY_COMMIT_SHA})."
    exit 0
  fi
  if [[ $(date +%s) -ge $deadline ]]; then
    log "ERROR: Server antwortet nach ${HEALTH_CHECK_TIMEOUT}s nicht auf Port ${RUNTIME_PORT}."
    if [[ -d "${DEST}.prev" ]]; then
      mv "$DEST" "${DEST}.failed" && mv "${DEST}.prev" "$DEST"
      if command -v mittnitectl >/dev/null 2>&1; then
        mittnitectl job restart 2>/dev/null || true
      fi
      log "Automatischer Rollback durchgefuehrt. Fehlgeschlagene Version: ${DEST}.failed"
    else
      log "Kein Rollback moeglich (keine ${DEST}.prev vorhanden)."
    fi
    exit 1
  fi
  sleep 2
done
