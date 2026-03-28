#!/usr/bin/env bash
set -euo pipefail

E2E_ENTRYPOINT="${E2E_ENTRYPOINT:-tests/e2e/run.sh}"
E2E_STRICT="${E2E_STRICT:-false}"

if [ -x "${E2E_ENTRYPOINT}" ]; then
  exec "${E2E_ENTRYPOINT}" "$@"
fi

if [ "${E2E_STRICT}" = "true" ]; then
  echo "E2E entrypoint '${E2E_ENTRYPOINT}' is missing or not executable."
  exit 1
fi

echo "E2E entrypoint '${E2E_ENTRYPOINT}' is not present yet; path is prepared for issue #7 assets."
