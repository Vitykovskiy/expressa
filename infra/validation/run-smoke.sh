#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-http://127.0.0.1:18081}"

if curl -fsS "${BASE_URL}/healthz" >/dev/null; then
  echo "Smoke check passed via /healthz"
  exit 0
fi

if curl -fsS "${BASE_URL}/" >/dev/null; then
  echo "Smoke check passed via fallback / endpoint"
  exit 0
fi

echo "Smoke check failed for ${BASE_URL}"
exit 1
