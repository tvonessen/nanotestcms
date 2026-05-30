#!/bin/sh
cd "$(dirname "$0")"
set -a
. ./.env
set +a
HOSTNAME=0.0.0.0
exec node server.js
