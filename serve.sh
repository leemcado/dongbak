#!/usr/bin/env bash
# 부스 운영용 — 로컬 서버를 띄우고 메인·관리자 창을 함께 연다.
# file:// 이 아니라 http://localhost 를 전제한다(모듈 로드·창간 통신·캔버스 오염).
# 사용:  bash serve.sh [포트]      종료: Ctrl+C
set -euo pipefail
PORT="${1:-8000}"
cd "$(dirname "$0")"

echo "메인     http://127.0.0.1:$PORT/index.html"
echo "관리자   http://127.0.0.1:$PORT/admin.html"
echo "종료하려면 Ctrl+C"

# 서버가 올라오면 창 두 개를 연다. 메인은 전체화면, 관리자는 일반 창.
(
  until curl -sf "http://127.0.0.1:$PORT/index.html" >/dev/null 2>&1; do sleep 0.2; done
  if [[ "$(uname)" == "Darwin" ]]; then
    open -na "Google Chrome" --args --start-fullscreen --new-window \
      "http://127.0.0.1:$PORT/index.html" 2>/dev/null || open "http://127.0.0.1:$PORT/index.html"
    sleep 1.5
    open -a "Google Chrome" "http://127.0.0.1:$PORT/admin.html" 2>/dev/null \
      || open "http://127.0.0.1:$PORT/admin.html"
  fi
) &

exec python3 -m http.server "$PORT" --bind 127.0.0.1
