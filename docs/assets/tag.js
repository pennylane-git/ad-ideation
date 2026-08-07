// 태그 대시보드 — 다중 선택(OR 조건) 필터링 + 카테고리별 아코디언(컴팩트 폼)
//   태그 칩을 클릭하면 활성화/비활성화 토글되며, 활성화된 태그가 하나라도 걸려있는 카드를 모두 보여줍니다.
//   아무 태그도 선택되지 않으면 안내 문구(빈 상태)를 보여줍니다.
//   ?tags=key1,key2 쿼리 파라미터로 특정 태그를 미리 선택한 상태로 진입할 수 있습니다(상세페이지 태그 칩 클릭 시 사용).
//
//   각 카테고리(사업모델별/노출형태별/노출지면별/플랫폼별/그룹 외)는 기본적으로 접혀있는 아코디언 행이며,
//   [카테고리명+화살표] 버튼을 클릭하면 펼쳐지고, 다른 행을 열면 자동으로 접혀서(한 번에 하나만 열림) 세로
//   길이를 최소화합니다. 그 옆에는 별도의 "전체선택/선택해제" 텍스트 버튼이 있는데, 펼치기 동작과는
//   완전히 분리된 액션입니다(중첩 버튼을 피하려고 형제 요소로 나눔). 노출 규칙:
//     - 접힌 상태 + 선택 없음 → 숨김
//     - 접힌 상태 + 1개 이상 선택됨 → "선택해제"(활성 색상)
//     - 펼친 상태 + 선택 없음 → "전체선택"(기본 색상)
//     - 펼친 상태 + 1개 이상 선택됨 → "선택해제"(활성 색상)
//   "전체선택" 클릭 시 그 카테고리의 모든 태그를 선택하고, "선택해제" 클릭 시 그 카테고리에서 선택된
//   태그를 전부 지웁니다(전부 선택돼있었는지 여부와 무관하게 일부만 선택돼 있어도 전부 해제).
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var pills = Array.prototype.slice.call(document.querySelectorAll('.tagpill'));
    var actionBtns = Array.prototype.slice.call(document.querySelectorAll('.tagform-action'));
    var cards = Array.prototype.slice.call(document.querySelectorAll('#tag-grid .card'));
    var grid = document.getElementById('tag-grid');
    var emptyState = document.getElementById('tag-empty-state');
    var clearBtn = document.getElementById('tagbar-clear');
    var countEl = document.getElementById('tag-count');
    var groups = Array.prototype.slice.call(document.querySelectorAll('.tagform .tagtree-group'));

    var selected = new Set();

    function groupTags(group) {
      return Array.prototype.slice.call(group.querySelectorAll('.tagpill'))
        .map(function (p) { return p.getAttribute('data-tag'); });
    }

    function updateGroupActions() {
      groups.forEach(function (group) {
        var actionBtn = group.querySelector('.tagform-action');
        var toggle = group.querySelector('.tagform-toggle');
        if (!actionBtn || !toggle) return;
        var allTags = groupTags(group);
        var selectedCount = allTags.filter(function (t) { return selected.has(t); }).length;
        var expanded = toggle.getAttribute('aria-expanded') === 'true';
        var visible = expanded || selectedCount > 0;

        if (!visible) {
          actionBtn.setAttribute('hidden', '');
          return;
        }
        actionBtn.removeAttribute('hidden');
        if (selectedCount > 0) {
          actionBtn.textContent = '선택해제';
          actionBtn.classList.add('active');
        } else {
          actionBtn.textContent = '전체선택';
          actionBtn.classList.remove('active');
        }
      });
    }

    function render() {
      if (selected.size === 0) {
        if (grid) grid.setAttribute('hidden', '');
        if (emptyState) emptyState.removeAttribute('hidden');
        if (countEl) countEl.textContent = '';
      } else {
        if (grid) grid.removeAttribute('hidden');
        if (emptyState) emptyState.setAttribute('hidden', '');
        var shown = 0;
        cards.forEach(function (c) {
          var tags = (c.getAttribute('data-tags') || '').split(',').filter(Boolean);
          var match = tags.some(function (t) { return selected.has(t); });
          if (match) { c.removeAttribute('hidden'); shown++; }
          else c.setAttribute('hidden', '');
        });
        if (countEl) countEl.textContent = shown + '개 결과';
      }
      pills.forEach(function (p) {
        p.classList.toggle('active', selected.has(p.getAttribute('data-tag')));
      });
      updateGroupActions();

      // URL 동기화 (공유 가능한 링크 유지)
      var url = new URL(window.location.href);
      if (selected.size) url.searchParams.set('tags', Array.from(selected).join(','));
      else url.searchParams.delete('tags');
      window.history.replaceState(null, '', url);
    }

    pills.forEach(function (p) {
      p.addEventListener('click', function () {
        var tag = p.getAttribute('data-tag');
        if (selected.has(tag)) selected.delete(tag);
        else selected.add(tag);
        render();
      });
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        selected.clear();
        render();
      });
    }

    // 카테고리별 "전체선택 / 선택해제" — 선택된 게 하나라도 있으면 전부 해제, 없으면 전체 선택.
    actionBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var group = btn.closest('.tagtree-group');
        if (!group) return;
        var allTags = groupTags(group);
        var hasSelection = allTags.some(function (t) { return selected.has(t); });
        if (hasSelection) {
          allTags.forEach(function (t) { selected.delete(t); });
        } else {
          allTags.forEach(function (t) { selected.add(t); });
        }
        render();
      });
    });

    // ---- 아코디언: 카테고리 행은 기본적으로 접혀있고, 한 번에 하나만 펼쳐진다 ----
    function setGroupOpen(group, open) {
      var toggle = group.querySelector('.tagform-toggle');
      var panel = group.querySelector('.tagform-panel');
      if (!toggle || !panel) return;
      if (open) {
        panel.removeAttribute('hidden');
        toggle.setAttribute('aria-expanded', 'true');
      } else {
        panel.setAttribute('hidden', '');
        toggle.setAttribute('aria-expanded', 'false');
      }
    }

    groups.forEach(function (group) {
      var toggle = group.querySelector('.tagform-toggle');
      if (!toggle) return;
      toggle.setAttribute('aria-expanded', 'false');
      toggle.addEventListener('click', function () {
        var isOpen = toggle.getAttribute('aria-expanded') === 'true';
        // 하나만 열리도록 다른 행은 모두 접는다.
        groups.forEach(function (g) { setGroupOpen(g, false); });
        setGroupOpen(group, !isOpen);
        updateGroupActions();
      });
    });

    // 초기 상태: ?tags= 쿼리 파라미터 반영
    var params = new URLSearchParams(window.location.search);
    var initTags = params.get('tags');
    if (initTags) {
      initTags.split(',').forEach(function (t) { if (t) selected.add(t); });
    }
    render();

    // 쿼리로 미리 선택된 태그가 있으면 그 태그가 속한 첫 카테고리를 자동으로 펼쳐서 보여준다.
    if (selected.size) {
      var firstMatch = groups.find(function (group) {
        return Array.prototype.slice.call(group.querySelectorAll('.tagpill'))
          .some(function (p) { return selected.has(p.getAttribute('data-tag')); });
      });
      if (firstMatch) {
        setGroupOpen(firstMatch, true);
        updateGroupActions();
      }
    }
  });
})();
