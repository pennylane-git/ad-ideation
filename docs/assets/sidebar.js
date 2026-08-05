// Sidebar tree — 3-step click cycle per top-level category
//   1st click (inactive → active)   : 미니 대시보드 (필터만 적용, 트리 접힘)
//   2nd click (active, 접힘 → 펼침)  : 하위 트리구조 노출
//   3rd click (active, 펼침 → 접힘)  : 메뉴 접힘 (대시보드는 유지)
//   다른 상위 메뉴 클릭 시 위 사이클이 새로 시작되며, 다른 그룹은 모두 초기화됨.
// 리스트 페이지(body[data-page="list"])에서는 즉시 카드 필터링,
// 상세 페이지(body[data-page="detail"])에서는 Research 리스트로 이동하며 ?cat= 파라미터로 대시보드 상태를 전달.
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var page = document.body.getAttribute('data-page');
    var groups = Array.prototype.slice.call(document.querySelectorAll('.sidebar-group'));
    var allLink = document.querySelector('.sidebar-link.all');
    var cards = Array.prototype.slice.call(document.querySelectorAll('#grid .card'));

    function applyFilter(cat) {
      if (!cards.length) return;
      cards.forEach(function (c) {
        if (cat === 'all' || c.getAttribute('data-cat') === cat) c.removeAttribute('hidden');
        else c.setAttribute('hidden', '');
      });
    }

    function setActiveGroup(cat) {
      groups.forEach(function (g) {
        g.classList.toggle('active', g.getAttribute('data-cat') === cat);
      });
      if (allLink) allLink.classList.toggle('active', !cat || cat === 'all');
    }

    function closeAllTrees() {
      groups.forEach(function (g) { g.classList.remove('open'); });
    }

    if (allLink) {
      allLink.addEventListener('click', function (e) {
        if (page === 'list') {
          e.preventDefault();
          applyFilter('all');
          setActiveGroup('all');
          closeAllTrees();
        }
        // detail 페이지에서는 기본 링크 동작(Research 홈으로 이동)을 그대로 사용
      });
    }

    groups.forEach(function (g) {
      var cat = g.getAttribute('data-cat');
      var toggle = g.querySelector('.group-toggle');
      toggle.addEventListener('click', function () {
        var isActive = g.classList.contains('active');
        var isOpen = g.classList.contains('open');

        if (!isActive) {
          // 1단계: 이 카테고리를 대시보드로 활성화, 트리는 접은 채로 시작
          closeAllTrees();
          setActiveGroup(cat);
          if (page === 'list') {
            applyFilter(cat);
          } else {
            window.location.href = './index.html?cat=' + encodeURIComponent(cat);
          }
        } else if (!isOpen) {
          // 2단계: 하위 트리 펼치기
          g.classList.add('open');
        } else {
          // 3단계: 트리 접기 (대시보드 상태는 유지)
          g.classList.remove('open');
        }
      });
    });

    if (page === 'list') {
      var params = new URLSearchParams(window.location.search);
      var initCat = params.get('cat');
      if (initCat) {
        applyFilter(initCat);
        setActiveGroup(initCat);
      }
    }
  });
})();
