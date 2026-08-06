// 헤더 앵커 링크
//   각 h2 헤딩(섹션/케이스 타이틀)에 마우스를 오버하면 링크 아이콘이 노출되고,
//   아이콘을 클릭하면 해당 헤딩으로 바로 이동하는 개별 URL(#id)이 클립보드에 복사됩니다.
//   대상 헤딩은 이미 TOC에서 쓰고 있는 id(section/케이스 블록의 id)를 그대로 재사용하므로
//   별도의 id 부여 없이 모든 상세 페이지에 공통 적용됩니다.
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var heads = Array.prototype.slice.call(
      document.querySelectorAll('.doc-section > h2, .case-block > h2')
    );
    if (!heads.length) return;

    var LINK_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 17H7A5 5 0 0 1 7 7h2"/><path d="M15 7h2a5 5 0 1 1 0 10h-2"/><line x1="8" y1="12" x2="16" y2="12"/></svg>';
    var CHECK_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';

    heads.forEach(function (h) {
      var target = h.closest('[id]');
      if (!target) return;
      var id = target.id;

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'heading-anchor';
      btn.innerHTML = LINK_SVG;
      btn.setAttribute('aria-label', '링크 복사');
      btn.setAttribute('data-tip', '링크를 헤더에 복사');

      var resetTimer = null;
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var url = location.origin + location.pathname + '#' + id;

        function showCopied() {
          btn.innerHTML = CHECK_SVG;
          btn.classList.add('copied');
          btn.setAttribute('data-tip', '복사되었습니다!');
          if (resetTimer) clearTimeout(resetTimer);
          resetTimer = setTimeout(function () {
            btn.innerHTML = LINK_SVG;
            btn.classList.remove('copied');
            btn.setAttribute('data-tip', '링크를 헤더에 복사');
          }, 1500);
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(showCopied, showCopied);
        } else {
          var ta = document.createElement('textarea');
          ta.value = url;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand('copy'); } catch (err) {}
          document.body.removeChild(ta);
          showCopied();
        }
      });

      h.appendChild(btn);
    });
  });
})();
