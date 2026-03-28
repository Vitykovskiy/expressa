#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_URL="${BASE_URL:-http://127.0.0.1:18081}"
ACTORS_FILE="${ACTORS_FILE:-${SCRIPT_DIR}/fixtures/actors.json}"
REJECTION_FILE="${REJECTION_FILE:-${SCRIPT_DIR}/fixtures/rejection.json}"
NODE_BIN="${NODE_BIN:-node}"
SCENARIO_FILE="${SCRIPT_DIR}/slice-a-api.e2e.mjs"

if ! command -v "${NODE_BIN}" >/dev/null 2>&1; then
  if command -v node.exe >/dev/null 2>&1; then
    NODE_BIN="node.exe"
  else
    echo "Node runtime is not available in PATH for tests/e2e/run.sh"
    exit 1
  fi
fi

if [ "${NODE_BIN}" = "node.exe" ]; then
  if command -v wslpath >/dev/null 2>&1; then
    SCENARIO_FILE="$(wslpath -w "${SCENARIO_FILE}")"
    ACTORS_FILE="$(wslpath -w "${ACTORS_FILE}")"
    REJECTION_FILE="$(wslpath -w "${REJECTION_FILE}")"
  elif command -v cygpath >/dev/null 2>&1; then
    SCENARIO_FILE="$(cygpath -w "${SCENARIO_FILE}")"
    ACTORS_FILE="$(cygpath -w "${ACTORS_FILE}")"
    REJECTION_FILE="$(cygpath -w "${REJECTION_FILE}")"
  fi
fi

"${NODE_BIN}" "${SCENARIO_FILE}" \
  --base-url "${BASE_URL}" \
  --actors "${ACTORS_FILE}" \
  --rejection "${REJECTION_FILE}"
