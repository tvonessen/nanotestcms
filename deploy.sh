#!/usr/bin/env bash

DEST=live

cp -a .next/standalone/. "$DEST"
cp -a .next/static "$DEST/.next/static"
cp -a public "$DEST/public"
cp -a data "$DEST/data"
cp .env "$DEST/.env"

# Stoppe alten Server
pkill -9 -f next

# Starte neuen Server
set -a
while IFS= read -r line; do
  [[ $line =~ ^#.*$ || -z $line ]] && continue
  export "$line"
done < "$DEST/.env"
set +a
node "$DEST/server.js"