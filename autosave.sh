#!/bin/bash
# 변경사항이 있을 때만 자동으로 커밋 + 푸시합니다.
cd "$(dirname "$0")"

git add -A

if ! git diff --cached --quiet; then
  git commit -m "자동 저장 $(date '+%Y-%m-%d %H:%M')"
  git push
fi
