#!/usr/bin/env bash
set -euo pipefail

if [ "$(id -u)" -ne 0 ]; then
  echo "deploy-baseline.sh must run as root."
  exit 1
fi

if [ $# -ne 1 ]; then
  echo "Usage: deploy-baseline.sh <compose-file-path>"
  exit 1
fi

if [ -z "${ADMIN_TELEGRAM_ID:-}" ]; then
  echo "ADMIN_TELEGRAM_ID is required."
  exit 1
fi

if [ -z "${DISABLE_TG_AUTH:-}" ]; then
  echo "DISABLE_TG_AUTH is required."
  exit 1
fi

COMPOSE_SOURCE="$1"
TARGET_DIR="/opt/expressa/staging"
TARGET_COMPOSE="${TARGET_DIR}/docker-compose.baseline.yml"
TARGET_ENV="${TARGET_DIR}/.env"

mkdir -p "${TARGET_DIR}"
cp "${COMPOSE_SOURCE}" "${TARGET_COMPOSE}"

cat > "${TARGET_ENV}" <<EOF
ADMIN_TELEGRAM_ID=${ADMIN_TELEGRAM_ID}
DISABLE_TG_AUTH=${DISABLE_TG_AUTH}
EOF

docker compose -f "${TARGET_COMPOSE}" --env-file "${TARGET_ENV}" up -d --remove-orphans

for _ in $(seq 1 30); do
  if curl -fsS "http://127.0.0.1:18080/" >/dev/null; then
    docker compose -f "${TARGET_COMPOSE}" ps
    exit 0
  fi
  sleep 2
done

echo "Stage0 baseline health check failed."
docker compose -f "${TARGET_COMPOSE}" ps
exit 1
