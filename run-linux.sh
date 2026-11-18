#!/usr/bin/env bash
set -euo pipefail

ROOT=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
BACKEND="$ROOT/backend"
MT5_EXE=${CT_MT5_EXE:-/mnt/data/mt5/drive_c/Program Files/MetaTrader 5/terminal64.exe}
export WINEPREFIX=${WINEPREFIX:-/mnt/data/mt5}
export CT_UI_DIR=${CT_UI_DIR:-$ROOT/frontend/dist}
export CT_BROKER=${CT_BROKER:-auto}
export CT_WINE_PYTHON=${CT_WINE_PYTHON:-/mnt/data/mt5/drive_c/Python311/python.exe}
export PYTHONPATH="Z:${ROOT}:${PYTHONPATH:+;$PYTHONPATH}"
export CT_MT5_PATH=${CT_MT5_PATH:-'C:\Program Files\MetaTrader 5\terminal64.exe'}

if [[ ! -f "$CT_UI_DIR/index.html" ]]; then
  echo "frontend/dist is missing; run: (cd frontend && npm ci && npm run build)" >&2
  exit 1
fi

if [[ -f "$MT5_EXE" ]] && ! pgrep -af 'terminal64\.exe' >/dev/null; then
  echo "Starting MetaTrader 5 with Wine..."
  wine "$MT5_EXE" >/tmp/cheaptrader-mt5.log 2>&1 &
  disown || true
fi
cd "$BACKEND"
uv run uvicorn app.main:app --host 127.0.0.1 --port "${CT_PORT:-8000}" &
server_pid=$!
trap 'kill "$server_pid" 2>/dev/null || true' EXIT

for _ in {1..60}; do
  if curl -fsS "http://127.0.0.1:${CT_PORT:-8000}/api/health" >/dev/null; then
    if command -v xdg-open >/dev/null; then
      xdg-open "http://127.0.0.1:${CT_PORT:-8000}/" >/dev/null 2>&1 || true
    fi
    wait "$server_pid"
    exit $?
  fi
  sleep 0.25
done

echo "CheapTrader did not start; inspect the server log above." >&2
exit 1
