// 태그 대시보드 — 다중 선택(OR 조건) 필터링
//   태그 칩을 클릭하면 활성화/비활성화 토글되며, 활성화된 태그가 하나라도 걸려있는 카드를 모두 보여줍니다.
//   아무 태그도 선택되지 않으면 안내 문구(빈 상태)를 보여줍니다.
//   ?tags=key1,key2 쿼리 파라미터로 특정 태그를 미리 선택한 상태로 진입할 수 있습니다(상세페이지 태그 칩 클릭 시 사용).
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var pills = Array.prototype.slice.call(document.querySelectorAll('.tagpill'));
    var cards = Array.prototype.slice.call(document.querySelectorAll('#tag-grid .card'));
    var grid = document.getElementById('tag-grid');
    var emptyState = document.getElementById('tag-empty-state');
    var clearBtn = document.getElementById('tagbar-clear');
    var countEl = document.getElementById('tag-count');

    var selected = new Set();

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

    // 초기 상태: ?tags= 쿼리 파라미터 반영
    var params = new URLSearchParams(window.location.search);
    var initTags = params.get('tags');
    if (initTags) {
      initTags.split(',').forEach(function (t) { if (t) selected.add(t); });
    }
    render();
  });
})();
