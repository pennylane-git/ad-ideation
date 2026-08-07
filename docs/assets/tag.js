// 태그 대시보드 — 다중 선택(OR 조건) 필터링 + 카테고리별 아코디언(컴팩트 폼)
//   태그 칩을 클릭하면 활성화/비활성화 토글되며, 활성화된 태그가 하나라도 걸려있는 카드를 모두 보여줍니다.
//   아무 태그도 선택되지 않으면 안내 문구(빈 상태)를 보여줍니다.
//   ?tags=key1,key2 쿼리 파라미터로 특정 태그를 미리 선택한 상태로 진입할 수 있습니다(상세페이지 태그 칩 클릭 시 사용).
//
//   각 카테고리(사업모델별/노출형태별/노출지면별/플랫폼별/그룹 외)는 기본적으로 접혀있는 아코디언 행이며,
//   카테고리명+화살표를 클릭하면 펼쳐지고, 다른 행을 열면 자동으로 접혀서(한 번에 하나만 열림) 세로 길이를 최소화합니다.
//   접힌 줄에는 선택 요약을 따로 표시하지 않고, 펼쳤을 때 패널 맨 위의 "전체 선택/전체 해제" 버튼으로
//   그 카테고리의 태그를 한 번에 켜고 끌 수 있습니다.
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    // .select-all 버튼은 실제 필터 태그가 아니라 "이 카테고리 전체 선택/해제" 액션이라 일반 pill 목록에서 제외한다.
    var pills = Array.prototype.slice.call(document.querySelectorAll('.tagpill:not(.select-all)'));
    var selectAllBtns = Array.prototype.slice.call(document.querySelectorAll('.tagpill.select-all'));
    var cards = Array.prototype.slice.call(document.querySelectorAll('#tag-grid .card'));
    var grid = document.getElementById('tag-grid');
    var emptyState = document.getElementById('tag-empty-state');
    var clearBtn = document.getElementById('tagbar-clear');
    var countEl = document.getElementById('tag-count');
    var groups = Array.prototype.slice.call(document.querySelectorAll('.tagform .tagtree-group'));

    var selected = new Set();

    function groupTags(group) {
      return Array.prototype.slice.call(group.querySelectorAll('.tagpill:not(.select-all)'))
        .map(function (p) { return p.getAttribute('data-tag'); });
    }

    // 접힌 줄에는 카테고리명 + 화살표만 두기로 해서 선택 요약 텍스트는 두지 않는다.
    // (패널을 펼쳤을 때 안에 있는 "전체 선택/전체 해제" 라벨만 갱신한다.)
    function updateSelectAllButtons() {
      groups.forEach(function (group) {
        var selectAllBtn = group.querySelector('.tagpill.select-all');
        if (!selectAllBtn) return;
        var allTags = groupTags(group);
        var allSelected = allTags.length > 0 && allTags.every(function (t) { return selected.has(t); });
        selectAllBtn.textContent = allSelected ? '전체 해제' : '전체 선택';
        selectAllBtn.classList.toggle('active', allSelected);
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
      updateSelectAllButtons();

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

    // 카테고리별 "전체 선택 / 전체 해제" 토글.
    selectAllBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var group = btn.closest('.tagtree-group');
        if (!group) return;
        var allTags = groupTags(group);
        var allSelected = allTags.length > 0 && allTags.every(function (t) { return selected.has(t); });
        if (allSelected) {
          allTags.forEach(function (t) { selected.delete(t); });
        } else {
          allTags.forEach(function (t) { selected.add(t); });
        }
        render();
      });
    });

    // ---- 아코디언: 카테고리 행은 기본적으로 접혀있고, 한 번에 하나만 펼쳐진다 ----
    function setGroupOpen(group, open) {
      var trigger = group.querySelector('.tagform-trigger');
      var panel = group.querySelector('.tagform-panel');
      if (!trigger || !panel) return;
      if (open) {
        panel.removeAttribute('hidden');
        trigger.setAttribute('aria-expanded', 'true');
      } else {
        panel.setAttribute('hidden', '');
        trigger.setAttribute('aria-expanded', 'false');
      }
    }

    groups.forEach(function (group) {
      var trigger = group.querySelector('.tagform-trigger');
      if (!trigger) return;
      trigger.setAttribute('aria-expanded', 'false');
      trigger.addEventListener('click', function () {
        var isOpen = trigger.getAttribute('aria-expanded') === 'true';
        // 하나만 열리도록 다른 행은 모두 접는다.
        groups.forEach(function (g) { setGroupOpen(g, false); });
        setGroupOpen(group, !isOpen);
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
      if (firstMatch) setGroupOpen(firstMatch, true);
    }
  });
})();
