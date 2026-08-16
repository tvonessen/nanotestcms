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

read_port_from_env_file() {
  local file="$1"
  [[ -f "$file" ]] || return 1

  local value
  value="$(grep -m1 '^PORT=' "$file" | cut -d= -f2- | tr -d '"' | tr -d "'" | tr -d '[:space:]' || true)"
  [[ -n "$value" ]] || return 1
  printf '%s\n' "$value"
}

resolve_runtime_port() {
  if [[ -n "${PORT:-}" ]]; then
    printf '%s\n' "$PORT"
    return 0
  fi

  local resolved
  resolved="$(read_port_from_env_file "$DEST/.env" || true)"
  if [[ -n "$resolved" ]]; then
    printf '%s\n' "$resolved"
    return 0
  fi

  resolved="$(read_port_from_env_file ".env" || true)"
  if [[ -n "$resolved" ]]; then
    printf '%s\n' "$resolved"
    return 0
  fi

  if command -v lsof >/dev/null 2>&1; then
    local node_pid
    node_pid="$(ps ax -o pid= -o command= | awk -v d="$DEST" \
      'index($0,"node") && index($0,d"/server.js"){print $1; exit}')"
    if [[ -n "${node_pid:-}" ]]; then
      resolved="$(lsof -Pan -p "$node_pid" -iTCP -sTCP:LISTEN 2>/dev/null \
        | awk 'NR>1{split($9,a,":"); print a[length(a)]; exit}' || true)"
      if [[ -n "$resolved" ]]; then
        printf '%s\n' "$resolved"
        return 0
      fi
    fi
  fi

  return 1
}

pid_on_port() {
  local port="$1"
  command -v lsof >/dev/null 2>&1 || return 1
  lsof -ti "tcp:${port}" -sTCP:LISTEN 2>/dev/null | head -n1
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

RUNTIME_PORT="$(resolve_runtime_port || true)"
if [[ -z "${RUNTIME_PORT:-}" ]]; then
  log "WARNUNG: PORT vor dem Restart nicht aufloesbar. Nutze Port-Autodetect waehrend Health-Check."
fi

# Capture the PID currently bound to the port *before* restarting, so the
# health check below can verify a genuinely new process took over — not just
# that *something* answers HTTP 200 (an old, never-actually-killed process
# would satisfy that just as well and mask a failed restart as "successful").
OLD_PID=""
if [[ -n "${RUNTIME_PORT:-}" ]]; then
  OLD_PID="$(pid_on_port "$RUNTIME_PORT" || true)"
  if [[ -n "$OLD_PID" ]]; then
    log "Bisheriger Prozess auf Port ${RUNTIME_PORT}: PID ${OLD_PID}."
  fi
fi

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

# Restart via mittnitectl (Mittwald's mittnite process supervisor)
if command -v mittnitectl >/dev/null 2>&1; then
  if ! mittnitectl job restart 2>/dev/null; then
    log "Kein laufender Job — versuche Start..."
    mittnitectl job start
  fi
  log "Prozess-Neustart via mittnitectl ausgelöst."
else
  log "WARNUNG: mittnitectl nicht gefunden — Fallback: SIGTERM."
  old_pid="$(ps ax -o pid= -o command= | awk -v d="$DEST" \
    'index($0,"node") && index($0,d"/server.js"){print $1; exit}')"
  if [[ -n "${old_pid:-}" ]]; then
    kill "$old_pid" 2>/dev/null || true
    log "SIGTERM an PID ${old_pid} gesendet."
  else
    log "Kein laufender Prozess gefunden."
  fi
fi

# HTTP health check
if ! command -v curl >/dev/null 2>&1; then
  log "WARNUNG: curl nicht verfügbar — kein Health-Check möglich."
  log "Deploy abgeschlossen (nicht verifiziert)."
  exit 0
fi

if [[ -n "$OLD_PID" ]] && ! command -v lsof >/dev/null 2>&1; then
  log "WARNUNG: lsof nicht verfügbar — kann nicht verifizieren, ob der alte Prozess (PID ${OLD_PID}) wirklich beendet wurde."
fi

if [[ -n "${RUNTIME_PORT:-}" ]]; then
  log "Warte auf Server-Antwort (Port ${RUNTIME_PORT}, Timeout ${HEALTH_CHECK_TIMEOUT}s)..."
else
  log "Warte auf Server-Antwort (Port-Autodetect, Timeout ${HEALTH_CHECK_TIMEOUT}s)..."
fi
deadline=$(( $(date +%s) + HEALTH_CHECK_TIMEOUT ))
# Give the supervisor roughly a third of the total timeout (min. 10s) to cycle
# the process on its own before we forcibly intervene.
escalate_deadline=$(( $(date +%s) + (HEALTH_CHECK_TIMEOUT / 3 > 10 ? HEALTH_CHECK_TIMEOUT / 3 : 10) ))
restart_escalated=false
last_pid=""
while true; do
  if [[ -z "${RUNTIME_PORT:-}" ]]; then
    RUNTIME_PORT="$(resolve_runtime_port || true)"
  fi

  current_pid=""
  if [[ -n "${RUNTIME_PORT:-}" ]]; then
    current_pid="$(pid_on_port "$RUNTIME_PORT" || true)"
    [[ -n "$current_pid" ]] && last_pid="$current_pid"
  fi

  if [[ -n "${RUNTIME_PORT:-}" ]] && curl -sf --max-time 3 "http://localhost:${RUNTIME_PORT}/" >/dev/null 2>&1; then
    if [[ -n "$OLD_PID" ]] && [[ -n "$current_pid" ]] && [[ "$current_pid" == "$OLD_PID" ]]; then
      # Something answers, but it's still the *old* process — mittnitectl's
      # restart did not actually replace it (the exact failure mode that
      # previously required manually killing the node process by hand).
      if [[ "$restart_escalated" == false ]] && [[ $(date +%s) -ge $escalate_deadline ]]; then
        log "WARNUNG: Alter Prozess (PID ${OLD_PID}) antwortet weiterhin nach dem Neustart-Versuch. Erzwinge harten Neustart..."
        kill -TERM "$OLD_PID" 2>/dev/null || true
        sleep 3
        if kill -0 "$OLD_PID" 2>/dev/null; then
          kill -KILL "$OLD_PID" 2>/dev/null || true
          log "SIGKILL an PID ${OLD_PID} gesendet (reagierte nicht auf SIGTERM)."
        fi
        if command -v mittnitectl >/dev/null 2>&1; then
          mittnitectl job restart 2>/dev/null || mittnitectl job start 2>/dev/null || true
        fi
        restart_escalated=true
      fi
      # Keep polling — do not declare success until a genuinely new PID answers.
    else
      rm -rf "${DEST}.prev"
      log "Server antwortet auf Port ${RUNTIME_PORT} (PID ${current_pid:-unbekannt}). Deploy erfolgreich abgeschlossen (Commit: ${DEPLOY_COMMIT_SHA})."
      exit 0
    fi
  fi
  if [[ $(date +%s) -ge $deadline ]]; then
    if [[ -n "$OLD_PID" ]] && [[ -n "$last_pid" ]] && [[ "$last_pid" == "$OLD_PID" ]]; then
      log "ERROR: Prozess wurde nach ${HEALTH_CHECK_TIMEOUT}s nicht neu gestartet (weiterhin PID ${OLD_PID} auf Port ${RUNTIME_PORT:-unbekannt})."
    else
      log "ERROR: Server antwortet nach ${HEALTH_CHECK_TIMEOUT}s nicht auf Port ${RUNTIME_PORT:-unbekannt}."
    fi
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
