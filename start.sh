#!/bin/sh
cd live/
set -a
. ./.env
set +a
HOSTNAME=0.0.0.0
export HOSTNAME

# Pruefe, ob Port 3000 frei ist (mit bis zu 10 Versuchen)
# Dies verhindert EADDRINUSE Fehler, falls der Port noch durch
# einen vorherigen Prozess belegt ist (z.B. TIME_WAIT Zustand).
MAX_RETRIES=10
RETRY_DELAY=2
for i in $(seq 1 $MAX_RETRIES); do
  if ! lsof -ti :3000 >/dev/null 2>&1 && ! ss -tuln | grep -q ':3000 '; then
    break
  fi
  echo "Port 3000 ist belegt (Versuch $i/$MAX_RETRIES). Warte $RETRY_DELAY Sekunden..."
  sleep $RETRY_DELAY
done

# Falls nach allen Versuchen immer noch belegt, warne
if [ "$i" -eq "$MAX_RETRIES" ]; then
  echo "WARNUNG: Port 3000 ist nach $MAX_RETRIES Versuchen immer noch belegt!"
fi

exec node server.js
