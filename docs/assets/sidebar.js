// Sidebar tree — 독립형 멀티 아코디언 (페이지 이동 후에도 펼침 상태 유지)
//   각 상위 카테고리는 서로 독립적으로 열고 닫힘.
//   하위 메뉴(링크)를 클릭해 다른 페이지로 이동해도, 이전에 열어둔 다른 카테고리들의 펼침 상태는
//   localStorage에 저장되어 새 페이지에서도 그대로 복원됨.
//   열려있는 상위 메뉴를 다시 클릭하면 그 메뉴만 접힘.
// 리스트 페이지(body[data-page="list"])에서는 카테고리를 열 때 카드 그리드도 해당 카테고리로 필터링됨.
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
    var page = document.body.getAttribute('data-page');
    var currentCat = document.body.getAttribute('data-current-cat') || null;
    var groups = Array.prototype.slice.call(document.querySelectorAll('.sidebar-group'));
    var allLink = document.querySelector('.sidebar-link.all');
    var cards = Array.prototype.slice.call(document.querySelectorAll('#grid .card'));

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

        var cats = loadOpenCats();
        if (willOpen) {
          if (cats.indexOf(cat) === -1) cats.push(cat);
        } else {
          cats = cats.filter(function (c) { return c !== cat; });
        }
        saveOpenCats(cats);

        if (page === 'list') {
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
        }
      });
    });

    if (page === 'list') {
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
    } else if (page === 'detail' && currentCat) {
      setActiveGroup(currentCat);
    }
  });
})();
