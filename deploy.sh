#!/usr/bin/env bash

DEST=live
STAGE="${DEST}.new"

rm -rf "$STAGE"
mkdir -p "$STAGE/.next"

cp -a .next/standalone/. "$STAGE"
cp -a .next/static "$STAGE/.next/static"
cp -a public "$STAGE/public"
cp -a data "$STAGE/data"
cp .env "$STAGE/.env"

# Stoppe alten Server
pkill -9 -f next

rm -rf "$DEST"
mv "$STAGE" "$DEST"

# Starte neuen Server
set -a
while IFS= read -r line; do
  [[ $line =~ ^#.*$ || -z $line ]] && continue
  export "$line"
done < "$DEST/.env"
set +a
node "$DEST/server.js"