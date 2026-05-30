#!/usr/bin/bash
set -euo pipefail

CD_PATH="${CD_PATH:-./}"
LIVE_DIR="${LIVE_DIR:-live}"
DATA_DIR="${DATA_DIR:-${LIVE_DIR}.data}"
LOG_DIR="${LOG_DIR:-./logs}"
LOG_FILE="${LOG_DIR}/deploy.log"

timestamp() {
  date '+%Y-%m-%dT%H:%M:%S%z' | sed -E 's/([+-][0-9]{2})([0-9]{2})$/\1:\2/'
}

log() {
  mkdir -p "$LOG_DIR"
  printf '[%s] %s\n' "$(timestamp)" "$*" | tee -a "$LOG_FILE"
}

run_compact() {
  local label="$1"
  shift

  local output_file
  output_file="$(mktemp)"

  if "$@" >"$output_file" 2>&1; then
    log "${label}: OK"
    rm -f "$output_file"
    return 0
  fi

  log "ERROR: ${label}"
  tail -n 20 "$output_file" | sed 's/^/  /' | tee -a "$LOG_FILE"
  rm -f "$output_file"
  exit 1
}

sync_build_data() {
  local source_data_path="$DATA_DIR"

  if [[ ! -d "$source_data_path" ]] && [[ -d "${LIVE_DIR}/data" ]]; then
    source_data_path="${LIVE_DIR}/data"
    log "Fallback: Nutze ${LIVE_DIR}/data fuer den Build."
  fi

  if [[ ! -d "$source_data_path" ]]; then
    if [[ ! -d "$LIVE_DIR" ]] && [[ -d "data" ]]; then
      log "Kein persistenter Datenordner gefunden. Erstinitialisierung mit vorhandenem ./data."
      return 0
    fi

    log "ERROR: Kein persistenter Datenordner gefunden (${DATA_DIR} oder ${LIVE_DIR}/data)."
    return 1
  fi

  rm -rf data
  cp -a "$source_data_path" data
  log "Build-Daten aus ${source_data_path} nach ./data synchronisiert."
}

cd "$CD_PATH"

mkdir -p "$LOG_DIR"
exec 9>"${LOG_DIR}/update.lock"
if ! flock -n 9; then
  printf '[%s] Update läuft bereits. Abbruch.\n' "$(timestamp)" >&2
  exit 0
fi

log "Update-Pruefung gestartet."

run_compact "git fetch" git fetch --quiet

LOCAL="$(git rev-parse @)"
REMOTE="$(git rev-parse '@{u}')"
BASE="$(git merge-base @ '@{u}')"

if [[ "$LOCAL" == "$REMOTE" ]]; then
  log "Keine Aenderungen."
  exit 0
fi

if [[ "$LOCAL" != "$BASE" ]]; then
  log "ERROR: Lokaler Branch ist divergent. Manuelles Eingreifen noetig."
  exit 1
fi

log "Aenderungen erkannt."
run_compact "git pull" git pull --ff-only --quiet
run_compact "pnpm install" pnpm install
run_compact "sync build data" sync_build_data
run_compact "pnpm build" pnpm build

if ! ./deploy.sh; then
  log "ERROR: deploy.sh fehlgeschlagen."
  exit 1
fi

log "Update abgeschlossen."
