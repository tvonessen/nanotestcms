#!/bin/sh
cd live/
set -a
. ./.env
set +a
HOSTNAME=0.0.0.0
exec node server.js
