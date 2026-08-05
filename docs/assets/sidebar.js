// Sidebar tree — 독립형 멀티 아코디언
//   각 상위 카테고리는 서로 독립적으로 열고 닫힘.
//   다른 상위 메뉴를 클릭해도 이미 열려있는 메뉴는 그대로 유지되고, 클릭한 메뉴의 하위 트리가 추가로 펼쳐짐.
//   열려있는 메뉴를 다시 클릭하면 그 메뉴만 접힘.
// 리스트 페이지(body[data-page="list"])에서는 카테고리를 열 때 카드 그리드도 해당 카테고리로 필터링됨.
// 상세 페이지(body[data-page="detail"])에서는 페이지 이동 없이 사이드바 트리만 펼쳐짐.
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

    if (allLink) {
      allLink.addEventListener('click', function (e) {
        if (page === 'list') {
          e.preventDefault();
          applyFilter('all');
          setActiveGroup('all');
        }
      });
    }

    groups.forEach(function (g) {
      var cat = g.getAttribute('data-cat');
      var toggle = g.querySelector('.group-toggle');
      toggle.addEventListener('click', function () {
        var willOpen = !g.classList.contains('open');
        g.classList.toggle('open', willOpen);

        if (willOpen) {
          setActiveGroup(cat);
          if (page === 'list') applyFilter(cat);
        } else {
          var anyOtherOpen = groups.some(function (o) { return o !== g && o.classList.contains('open'); });
          if (!anyOtherOpen) {
            setActiveGroup('all');
            if (page === 'list') applyFilter('all');
          }
        }
      });
    });

    if (page === 'list') {
      var params = new URLSearchParams(window.location.search);
      var initCat = params.get('cat');
      if (initCat) {
        groups.forEach(function (g) {
          if (g.getAttribute('data-cat') === initCat) g.classList.add('open');
        });
        applyFilter(initCat);
        setActiveGroup(initCat);
      }
    }
  });
})();
