# DA ideation — 프로젝트 컨텍스트

카카오톡 신규 광고 상품 아이디어 리서치 저장소 겸 웹 대시보드. 빌드 과정 없는 순수 정적 HTML 사이트.

- 저장소: https://github.com/pennylane-git/ad-ideation
- 라이브 사이트: https://pennylane-git.github.io/ad-ideation/ (GitHub Pages, `docs/`가 소스, `noindex`로 비공개 처리)
- 로컬 공통 작업 경로: `~/Documents/Claude/ad-ideation`
- 현재 진행 상황·다음 할 일: [PROGRESS.md](./PROGRESS.md) 참고 (이 파일은 구조/컨벤션만 다루고, 롤링 상태는 PROGRESS.md가 담당)

## 폴더 구조

```
docs/
  index.html              홈 (사이트 인트로 + Research/Prototype 진입)
  research/index.html     Research 목록 (카테고리별 카드)
  research/tag.html       태그 멀티셀렉트 대시보드 (카드 + 태그 트리)
  research/*.html         아이디어별 상세페이지
  assets/
    style.css, sidebar.js, tag.js, theme.js, toc.js, imagezoom.js, headinganchor.js
    flows/                상세페이지용 플로우 이미지·영상
    icons/                벤치마킹 플랫폼 아이콘
.claude/
  launch.json             로컬 프리뷰 서버 설정 (python3 http.server, 8420, docs/ 기준)
  skills/                 반복 워크플로우 정의
autosave.sh               변경사항이 있을 때만 `git add -A && commit && push` (자동 저장용, 수동 실행)
```

## 핵심 컨벤션

- **카테고리(`data-cat`)**: `feed`(피드형) · `full`(전면형) · `list`(리스트형) · `banner`(배너형) · `profile`(프로필형) · `etc`(기타). 사이드바 색상은 `--cat-*` CSS 변수.
- **태그(`data-tags`)**: 카테고리와 별개의 분류 축. `research/tag.html`에만 태그 트리(태그별 카운트 포함)와 `data-tags` 카드가 있고, 상세페이지에는 `tag-chip` 링크(`tag.html?tags=슬러그`)만 있음.
- **에셋 네이밍**: `assets/flows/<slug>.png|webp`(플로우 이미지), `assets/flows/<slug>-video-N.mp4`(샘플 영상). 멀티케이스 페이지는 `<slug>-case-a`, `<slug>-case-b` 접두.
- **상세페이지 섹션 순서**: 사용자 플로우 → 플로우 디스크립션 → 샘플 영상 → 카카오 지면 적용 포인트 → 참고(출처/검토상태).

## ⚠️ 중요: 사이드바는 컴포넌트가 아니라 전체 페이지에 복붙되어 있음

`docs/index.html`을 제외한 모든 페이지(`research/index.html`, `research/tag.html`, `research/*.html` 상세페이지 30여 개)가 사이드바 HTML 전체를 각자 인라인으로 갖고 있음(템플릿/include 없음). 새 아이디어 페이지를 추가하거나 카테고리 라벨을 바꾸면 **모든 파일의 사이드바를 동일하게 수동 갱신**해야 드리프트가 안 생김. 이 반복 작업은 `.claude/skills/add-idea-page/`에 체크리스트로 정리해 둠 — 새 상세페이지를 추가할 때는 그 스킬을 따를 것.

## 배포

`main` 브랜치 push → GitHub Pages가 `docs/`를 그대로 서빙. 별도 빌드 스텝 없음.
