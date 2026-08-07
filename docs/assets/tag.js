// 태그 대시보드 — 다중 선택(OR 조건) 필터링 + 카테고리별 아코디언(컴팩트 폼)
//   태그 칩을 클릭하면 활성화/비활성화 토글되며, 활성화된 태그가 하나라도 걸려있는 카드를 모두 보여줍니다.
//   아무 태그도 선택되지 않으면 안내 문구(빈 상태)를 보여줍니다.
//   ?tags=key1,key2 쿼리 파라미터로 특정 태그를 미리 선택한 상태로 진입할 수 있습니다(상세페이지 태그 칩 클릭 시 사용).
//
//   각 카테고리(사업모델별/노출형태별/노출지면별/플랫폼별/그룹 외)는 기본적으로 접혀있는 아코디언 행이며,
//   트리거를 클릭하면 펼쳐지고, 다른 행을 열면 자동으로 접혀서(한 번에 하나만 열림) 세로 길이를 최소화합니다.
//   각 트리거 옆에는 그 카테고리 안에서 선택된 태그 요약("전체" / "성과형 광고" / "성과형 광고 외 1개")이 표시됩니다.
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var pills = Array.prototype.slice.call(document.querySelectorAll('.tagpill'));
    var cards = Array.prototype.slice.call(document.querySelectorAll('#tag-grid .card'));
    var grid = document.getElementById('tag-grid');
    var emptyState = document.getElementById('tag-empty-state');
    var clearBtn = document.getElementById('tagbar-clear');
    var countEl = document.getElementById('tag-count');
    var groups = Array.prototype.slice.call(document.querySelectorAll('.tagform .tagtree-group'));

    var selected = new Set();

    // 태그 pill의 순수 라벨 텍스트만 추출(아이콘 이미지·카운트 숫자는 제외).
    function pillLabel(pill) {
      var clone = pill.cloneNode(true);
      var count = clone.querySelector('.count');
      if (count) count.remove();
      var icon = clone.querySelector('img, .tab-icon');
      if (icon) icon.remove();
      return clone.textContent.replace(/\s+/g, ' ').trim();
    }

    function updateGroupSummaries() {
      groups.forEach(function (group) {
        var summaryEl = group.querySelector('.tagform-summary');
        if (!summaryEl) return;
        var groupPills = Array.prototype.slice.call(group.querySelectorAll('.tagpill'));
        var activeLabels = groupPills
          .filter(function (p) { return selected.has(p.getAttribute('data-tag')); })
          .map(pillLabel);
        if (activeLabels.length === 0) {
          summaryEl.textContent = '전체';
          summaryEl.classList.remove('has-selection');
        } else if (activeLabels.length === 1) {
          summaryEl.textContent = activeLabels[0];
          summaryEl.classList.add('has-selection');
        } else {
          summaryEl.textContent = activeLabels[0] + ' 외 ' + (activeLabels.length - 1) + '개';
          summaryEl.classList.add('has-selection');
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
      updateGroupSummaries();

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
