#!/usr/bin/env bash
set -euo pipefail

E2E_ENTRYPOINT="${E2E_ENTRYPOINT:-tests/e2e/run.sh}"
E2E_STRICT="${E2E_STRICT:-false}"

if [ -f "${E2E_ENTRYPOINT}" ]; then
  exec bash "${E2E_ENTRYPOINT}" "$@"
fi

if [ "${E2E_STRICT}" = "true" ]; then
  echo "E2E entrypoint '${E2E_ENTRYPOINT}' is missing."
  exit 1
fi

echo "E2E entrypoint '${E2E_ENTRYPOINT}' is not present yet; path is prepared for QA assets."
