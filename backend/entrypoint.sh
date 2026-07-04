#!/bin/bash
set -euo pipefail

if [ "${ENV:-development}" = "production" ]; then
  echo "Running database migrations..."
  alembic upgrade head
fi

exec "$@"
