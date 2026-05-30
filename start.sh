#!/bin/sh
cd ./live/
set -a
. ./.env
set +a
exec node server.js