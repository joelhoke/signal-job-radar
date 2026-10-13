#!/usr/bin/env bash
set -euo pipefail

rm -rf dist
mkdir -p dist
node scripts/build-worker.mjs
