// Sidebar tree — 독립형 멀티 아코디언 (페이지 이동 후에도 펼침 상태 유지)
//   각 상위 카테고리는 서로 독립적으로 열고 닫힘. 열려있는 상위 메뉴를 다시 클릭하면 그 메뉴만 접힘.
//   하위 메뉴(링크)를 클릭해 다른 페이지로 이동해도, 이전에 열어둔 다른 카테고리들의 펼침 상태는
//   localStorage에 저장되어 새 페이지에서도 그대로 복원됨.
//
// 필터링 로직 (트리 열기/접기와는 별개의 동작):
//   - 카드 그리드(#grid)가 있는 페이지(research/index.html)에서 상위 메뉴를 클릭하면
//     해당 카테고리만 그리드에 필터링되어 보임 (기존 열기/접기 동작은 그대로 유지됨).
//   - 카드 그리드가 없는 페이지(상세페이지, 태그 페이지)에서 상위 메뉴를 클릭하면
//     research/index.html?cat={카테고리}로 이동해 그 카테고리만 필터링된 화면을 보여줌.
//   - "전체보기"를 클릭하면 그리드가 있는 페이지에서는 트리 열림 상태를 건드리지 않고
//     그리드만 전체(30개)로 되돌림. 그리드가 없는 페이지에서는 research/index.html(전체)로 이동.
(function () {
  var STORAGE_KEY = 'daideation_open_cats';

  function loadOpenCats() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      var list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list : [];
    } catch (e) {
      return [];
    }
  }

  function saveOpenCats(list) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      /* localStorage 사용 불가 시 무시 (펼침 상태만 유지 안 됨) */
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    var currentCat = document.body.getAttribute('data-current-cat') || null;
    var groups = Array.prototype.slice.call(document.querySelectorAll('.sidebar-group'));
    var allLink = document.querySelector('.sidebar-link.all');
    var grid = document.getElementById('grid');
    var hasGrid = !!grid;
    var cards = hasGrid ? Array.prototype.slice.call(grid.querySelectorAll('.card')) : [];

    var openCats = loadOpenCats();
    if (currentCat && openCats.indexOf(currentCat) === -1) {
      openCats.push(currentCat);
      saveOpenCats(openCats);
    }
    groups.forEach(function (g) {
      if (openCats.indexOf(g.getAttribute('data-cat')) !== -1) g.classList.add('open');
    });

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
        if (hasGrid) {
          // 그리드가 있는 페이지: 트리 열림 상태는 그대로 두고 그리드만 전체로 되돌림
          e.preventDefault();
          applyFilter('all');
          setActiveGroup('all');
        }
        // 그리드가 없는 페이지(상세/태그): 기본 링크 동작으로 Research 리스트(전체)로 이동
      });
    }

    groups.forEach(function (g) {
      var cat = g.getAttribute('data-cat');
      var toggle = g.querySelector('.group-toggle');
      toggle.addEventListener('click', function () {
        if (hasGrid) {
          // 트리 열기/접기 동작 — 카테고리별로 독립적, 그대로 유지
          var willOpen = !g.classList.contains('open');
          g.classList.toggle('open', willOpen);

          var cats = loadOpenCats();
          if (willOpen) {
            if (cats.indexOf(cat) === -1) cats.push(cat);
          } else {
            cats = cats.filter(function (c) { return c !== cat; });
          }
          saveOpenCats(cats);

          if (willOpen) {
            setActiveGroup(cat);
            applyFilter(cat);
          } else {
            var anyOtherOpen = groups.some(function (o) { return o !== g && o.classList.contains('open'); });
            if (!anyOtherOpen) {
              setActiveGroup('all');
              applyFilter('all');
            }
          }
        } else {
          // 그리드가 없는 페이지: Research 리스트로 이동하며 해당 카테고리만 필터링
          window.location.href = './index.html?cat=' + encodeURIComponent(cat);
        }
      });
    });

    if (hasGrid) {
      var params = new URLSearchParams(window.location.search);
      var initCat = params.get('cat');
      if (initCat) {
        if (openCats.indexOf(initCat) === -1) {
          openCats.push(initCat);
          saveOpenCats(openCats);
        }
        var target = groups.filter(function (g) { return g.getAttribute('data-cat') === initCat; })[0];
        if (target) target.classList.add('open');
        applyFilter(initCat);
        setActiveGroup(initCat);
      }
    } else if (currentCat) {
      setActiveGroup(currentCat);
    }
  });
})();
