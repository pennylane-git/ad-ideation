# PROGRESS

이 파일은 기기(집/회사 PC)가 바뀌어 대화 기록이 끊겨도 새 Claude 세션이 바로 맥락을 파악할 수 있도록 남기는 작업 기록입니다. 업데이트할 때마다 이 파일도 함께 커밋·푸시해주세요.

## 프로젝트 개요

카카오톡 신규 광고 상품 아이디어를 발굴하기 위한 리서치 저장소 겸 웹 대시보드.

- 저장소: https://github.com/pennylane-git/ad-ideation
- 라이브 사이트: https://pennylane-git.github.io/ad-ideation/ (GitHub Pages, `docs/` 폴더가 소스, `noindex`로 비공개 처리)
- 로컬 작업 경로 (기기 공통 권장): `~/Documents/Claude/ad-ideation`

## 현재 구조

```
docs/
  index.html              홈 (사이트 인트로 + Research/Prototype 진입)
  research/index.html     Research 대시보드 (지면 유형별 30개 아이디어 카드)
  research/*.html         아이디어별 상세페이지 (32개 파일, 일부는 Case A/B 멀티케이스)
  research/tag.html       태그 멀티셀렉트 대시보드
  assets/                 로고·파비콘·style.css·sidebar.js·tag.js·theme.js 등
```

Research 지면 유형 7개(피드형·전면형·리스트형·커머스형·배너형·보상형·프로필형), 아이디어 30개, 태그 시스템 15개 태그, business model/format/surface 3개 트리로 그룹핑.

## 지금까지 완성된 것 (마지막 커밋: 2026-08-06 18:43)

1. **IA/템플릿**: 홈 → Research 리스트 → 상세페이지 구조(SEED 스타일) 구축, 30개 아이디어 상세페이지 전체 생성
2. **사이드바**: 트리 구조 접기/펼치기, 독립형 멀티 아코디언(다른 카테고리 클릭해도 기존 열린 트리 유지), 펼침 상태 localStorage 저장
3. **태그 시스템**: 15개 태그 정의, 상세페이지 태그칩, 태그 멀티셀렉트 대시보드(`tag.html`), 이후 business model/format/surface 3개 트리로 재구성
4. **상세페이지 구조**: 사용자플로우 → 플로우디스크립션 → 샘플영상 → 카카오 지면 적용 포인트 순서로 정리, h2 제목에 hover 시 링크 복사 앵커 추가
5. **플로우 이미지/영상 컨테이너**: 900:440 고정 비율, object-fit:contain, 확대 가능한 줌 모달(프레임 단위로 확대, 종횡비 유지), 영상은 재생 컨트롤·진행바 포함해 별도 패딩 처리
6. **멀티케이스 페이지**: `content-monetization.html`을 Case A(단일 배너형)/Case B(스와이프 카드형)로 분리, 케이스별로 플로우/설명/영상을 함께 묶는 계층 구조, TOC도 케이스 단위로 들여쓰기
7. **다크모드**: 사이트 전체 라이트/다크 토글 추가

## 알려진 미완성 항목

- **Prototype 섹션**: 홈 네비게이션에 "Prototype (Soon)"으로만 표시되어 있고 실제 화면/콘텐츠는 아직 없음
- Case A/B 멀티케이스 구조가 적용된 페이지는 현재 `content-monetization.html` 하나뿐 — 다른 상세페이지에도 필요하면 확장 검토
- 태그 분류는 README/사이트에 "잠정안이며 추후 재배치 예정"이라고 명시되어 있음

## 다음에 할 일 (필요시 갱신)

- (여기에 다음 작업 항목을 적어두세요)

## 기기 전환 시 체크리스트

1. 작업 끝낼 때: `git add -A && git commit -m "..." && git push`
2. 새 기기에서: 저장소가 없으면 `git clone https://github.com/pennylane-git/ad-ideation.git`, 있으면 `git pull`
3. Claude에게 해당 폴더 연결 요청 → 이 PROGRESS.md부터 읽게 하면 바로 맥락 복구 가능

## 주의: Claude가 세션 중 직접 push한 경우

Claude가 (사용자 대신 GitHub 토큰으로) 이 세션에서 직접 커밋·푸시를 했을 수 있습니다. 이 작업은 우회 경로(임시 클론)를 거쳐 처리되기 때문에, 로컬 `~/Documents/Claude/ad-ideation` 폴더의 git 기록이 origin보다 뒤처져 있을 수 있습니다(작업 파일 내용 자체는 최신 상태와 동일함, git 기록만 안 맞음).

**따라서 다음에 이 폴더에서 작업을 이어가기 전에 penny님이 직접 터미널에서 `git pull`을 한 번 실행해주세요.** (충돌 없이 바로 반영됩니다.) Claude가 이 사실을 언급하지 않더라도, 폴더를 다시 열 때는 습관적으로 `git pull`부터 실행하는 걸 권장합니다.
