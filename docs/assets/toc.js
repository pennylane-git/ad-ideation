// Scroll-spy for right-side anchor TOC
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var links = Array.prototype.slice.call(document.querySelectorAll('.toc-tree a'));
    if (!links.length) return;
    var targets = links
      .map(function (a) {
        var id = a.getAttribute('href').replace('#', '');
        var el = document.getElementById(id);
        return el ? { link: a, el: el } : null;
      })
      .filter(Boolean);

    function setActive(id) {
      links.forEach(function (a) {
        a.classList.toggle('active', a.getAttribute('href') === '#' + id);
      });
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-15% 0px -70% 0px', threshold: 0 }
    );

    targets.forEach(function (t) { observer.observe(t.el); });
  });
})();
