#!/usr/bin/env bash
set -euo pipefail

DEST="${DEST:-live}"
STAGE="${DEST}.new"
LOG_DIR="${LOG_DIR:-logs}"
LOG_FILE="${LOG_DIR}/deploy.log"
SERVER_LOG="${LOG_DIR}/server.log"
PIDFILE="${DEST}/server.pid"
HAD_PIDFILE=0

if [[ -f "$PIDFILE" ]]; then
  HAD_PIDFILE=1
fi

timestamp() {
  date '+%Y-%m-%d %H:%M:%S'
}

log() {
  mkdir -p "$LOG_DIR"
  printf '[%s] %s\n' "$(timestamp)" "$*" >> "$LOG_FILE"
}

cleanup() {
  rm -rf "$STAGE"
}

find_running_pid() {
  if [[ -f "$PIDFILE" ]]; then
    local pid
    pid="$(cat "$PIDFILE" 2>/dev/null || true)"
    if [[ -n "$pid" ]] && kill -0 "$pid" 2>/dev/null; then
      printf '%s\n' "$pid"
      return 0
    fi
  fi

  ps ax -o pid= -o command= | awk -v dest="/${DEST}/server.js" '
    index($0, "node") && index($0, dest) { print $1; exit }
  '
}

trap cleanup EXIT

log "Deploy gestartet."

rm -rf "$STAGE"
mkdir -p "$STAGE/.next"

cp -a .next/standalone/. "$STAGE"
cp -a .next/static "$STAGE/.next/static"
cp -a public "$STAGE/public"
cp -a data "$STAGE/data"
cp .env "$STAGE/.env"

old_pid="$(find_running_pid || true)"
if [[ -n "${old_pid:-}" ]]; then
  kill "$old_pid"
  log "Alter Server gestoppt (PID ${old_pid})."
elif [[ "$HAD_PIDFILE" -eq 1 ]]; then
  rm -f "$PIDFILE"
  log "PID-File vorhanden, aber kein laufender Server gefunden."
else
  log "Kein PID-File gefunden. Initialer Start."
fi

rm -rf "$DEST"
mv "$STAGE" "$DEST"

set -a
. "$DEST/.env"
set +a

mkdir -p "$LOG_DIR"
nohup node "$DEST/server.js" >> "$SERVER_LOG" 2>&1 < /dev/null &
new_pid=$!
echo "$new_pid" > "$PIDFILE"

if kill -0 "$new_pid" 2>/dev/null; then
  log "Neuer Server gestartet (PID ${new_pid})."
  log "Deploy abgeschlossen."
else
  log "ERROR: Serverstart fehlgeschlagen."
  exit 1
fi
