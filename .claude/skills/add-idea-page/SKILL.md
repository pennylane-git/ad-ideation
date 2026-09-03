---
name: add-idea-page
description: DA ideation 저장소에 새 광고 아이디어 상세페이지를 추가할 때 사용. 사이드바가 모든 페이지에 복붙되어 있어 한 곳만 고치면 드리프트가 나므로, 새 페이지 추가 시 건드려야 할 모든 파일을 체크리스트로 안내.
---

# 새 아이디어 상세페이지 추가하기

DA ideation은 템플릿/컴포넌트 시스템이 없는 순수 정적 HTML이라, 새 아이디어를 추가하려면 여러 파일을 손으로 동기화해야 함. 하나라도 빠뜨리면 사이드바 드리프트나 태그 카운트 불일치가 생기니 아래 순서를 그대로 따를 것.

## 0. 정보 확정

- 슬러그(`kebab-case`, 파일명·에셋명에 공용), 카테고리(`feed`/`full`/`list`/`banner`/`profile`/`etc`), 표시 제목, 한 줄 설명, 태그(기존 `research/tag.html`의 태그 목록에서 고르거나 신규 정의).

## 1. 상세페이지 생성 — `docs/research/<slug>.html`

기존 페이지 중 카테고리가 같은 것(예: 리스트형이면 `mission-reward.html`)을 그대로 복사해서 시작. 유지해야 할 것:

- `<title>`, `<meta>`, 사이드바 전체(2단계에서 갱신), `.crumb`, `.eyebrow`, `.page-title`, `.page-desc`
- `.tag-row`의 `tag-chip` 링크들 (`tag.html?tags=슬러그`)
- 섹션 순서: 사용자 플로우 → 플로우 디스크립션 → 샘플 영상 → 카카오 지면 적용 포인트 → 참고
- `.toc` 앵커는 실제 섹션 `id`와 1:1 일치해야 함
- 에셋: `docs/assets/flows/<slug>.png|webp`(플로우), `docs/assets/flows/<slug>-video-1.mp4`(샘플 영상, 없으면 해당 섹션 자체를 삭제 — placeholder 금지)

## 2. 사이드바 갱신 — **모든** 파일

사이드바는 컴포넌트가 아니라 각 파일에 인라인 복붙되어 있음. 새 링크(`<a href="../research/<slug>.html">제목</a>`)를 해당 `data-cat` 그룹의 `.group-children`에 추가해야 하는 대상:

- `docs/research/index.html`
- `docs/research/tag.html`
- `docs/research/*.html` 기존 상세페이지 전부 (새로 만든 페이지 포함, 자기 자신에는 `class="active"` 부여)

한 파일에서 정확한 삽입 위치를 정한 뒤, 같은 diff를 나머지 전체 파일에 동일하게 적용할 것. (파일 수가 많으므로 `grep -rl` 로 해당 `data-cat` 그룹을 가진 파일을 먼저 뽑고 스크립트/일괄 치환으로 처리하는 걸 권장.)

## 3. `docs/research/index.html`에 카드 추가

해당 카테고리 섹션 안에 카드 추가, `id`는 카테고리 접두사 다음 번호(`feed-8`, `list-3` 등 — 기존 최대값 확인 후 +1):

```html
<a class="card" id="<cat>-<n>" data-cat="<cat>" href="./<slug>.html">
  <span class="card-tag" style="background:var(--cat-<cat>);color:#1a0f00"><카테고리 라벨></span>
  <div class="card-title"><제목></div>
  <div class="card-desc"><한 줄 설명></div>
  <div class="card-meta"><span class="badge">...</span></div>
</a>
```

## 4. `docs/research/tag.html`에 카드 + 태그 카운트 추가

- 같은 카테고리 섹션에 카드 추가, `data-tags="tag1,tag2,..."` 포함 (id는 의미 있는 접두사 사용 가능, 기존 관례 참고: `reward-`, `list-` 등)
- 사용한 태그마다 `tagpill`의 `<span class="count">N</span>`을 +1 — 신규 태그면 적절한 `tagtree-group`(business model / format / surface) 아래에 `tagpill` 자체를 새로 추가

## 5. 검증

```bash
python3 -m http.server 8420 --directory docs
```

(또는 `.claude/launch.json`의 `ad-ideation-preview` 프리뷰 사용) 새 페이지·목록 카드·태그 카드·사이드바 링크(전체 페이지에서 일관되게 보이는지)를 직접 열어서 확인.

## 6. 커밋

`PROGRESS.md`의 "완성된 것" 목록에 한 줄 추가 후, 저장소 컨벤션대로 한글 커밋 메시지로 커밋 (예: `<slug>: 사용자 플로우 이미지·샘플 영상 등록`).
