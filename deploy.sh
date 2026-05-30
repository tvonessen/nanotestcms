#!/usr/bin/bash
set -euo pipefail

DEST="${DEST:-live}"
STAGE="${DEST}.new"
DATA_DIR="${DATA_DIR:-${DEST}.data}"
LOG_DIR="${LOG_DIR:-logs}"
LOG_FILE="${LOG_DIR}/deploy.log"
HEALTH_CHECK_TIMEOUT="${HEALTH_CHECK_TIMEOUT:-90}"

timestamp() {
  date '+%Y-%m-%dT%H:%M:%S%:z'
}

log() {
  mkdir -p "$LOG_DIR"
  printf '[%s] %s\n' "$(timestamp)" "$*" | tee -a "$LOG_FILE"
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

  local backup_dir backup_name data_parent data_name
  backup_dir="${LOG_DIR}/data-backups"
  backup_name="data-$(date '+%Y%m%d-%H%M%S').tar.gz"
  data_parent="$(dirname "$DATA_DIR")"
  data_name="$(basename "$DATA_DIR")"

  mkdir -p "$backup_dir"
  tar -C "$data_parent" -czf "${backup_dir}/${backup_name}" "$data_name"
  log "Backup von ${DATA_DIR} erstellt: ${backup_dir}/${backup_name}"
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

rm -rf "${DEST}.prev"
rm -rf "$STAGE"
mkdir -p "$STAGE/.next"

cp -a .next/standalone/. "$STAGE"
cp -a .next/static "$STAGE/.next/static"
cp -a public "$STAGE/public"

# start.sh: loads .env and starts the server — used as the mittnite job command
# (plain `node server.js` does not auto-load .env in Next.js standalone mode)
cat > "$STAGE/start.sh" << 'EOF'
#!/bin/sh
cd "$(dirname "$0")"
set -a
. ./.env
set +a
exec node server.js
EOF
chmod +x "$STAGE/start.sh"

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

# PORT wird von der Mittwald-Plattform vorgegeben und darf nicht hartcodiert werden.
# Lese aus laufender Umgebung, dann aus .env — schlägt beides fehl, brich ab.
if [[ -z "${PORT:-}" ]] && [[ -f ".env" ]]; then
  PORT="$(grep -m1 '^PORT=' .env | cut -d= -f2 | tr -d '"' | tr -d "'")"
fi
if [[ -z "${PORT:-}" ]]; then
  log "ERROR: PORT nicht gesetzt. Bitte in .env oder Mittwald-Umgebungsvariablen konfigurieren."
  exit 1
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

log "Warte auf Server-Antwort (Port ${PORT}, Timeout ${HEALTH_CHECK_TIMEOUT}s)..."
deadline=$(( $(date +%s) + HEALTH_CHECK_TIMEOUT ))
while true; do
  if curl -sf --max-time 3 "http://localhost:${PORT}/" >/dev/null 2>&1; then
    log "Server antwortet auf Port ${PORT}. Deploy erfolgreich abgeschlossen."
    exit 0
  fi
  if [[ $(date +%s) -ge $deadline ]]; then
    log "ERROR: Server antwortet nach ${HEALTH_CHECK_TIMEOUT}s nicht auf Port ${PORT}."
    log "Rollback: mv ${DEST} ${DEST}.failed && mv ${DEST}.prev ${DEST} && mittnitectl job restart"
    exit 1
  fi
  sleep 2
done
