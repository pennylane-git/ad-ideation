// 플로우 이미지 확대/축소 (react-medium-image-zoom 스타일을 순수 JS로 재현)
//   .flow-image-container.zoomable 요소를 클릭하면 50% 딤드 모달로 이미지가 페이드인 확대됩니다.
//   모달을 다시 클릭하거나 ESC를 누르면 페이드아웃되며 닫힙니다.
//   커서는 브라우저 네이티브 zoom-in/zoom-out 키워드를 사용 — 대부분의 브라우저에서
//   실제로 "돋보기 + / -" 아이콘으로 렌더링되어 별도 커스텀 커서 이미지가 필요 없습니다.
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var containers = Array.prototype.slice.call(document.querySelectorAll('.flow-image-container.zoomable'));
    if (!containers.length) return;

    var overlay = document.createElement('div');
    overlay.className = 'izm-overlay';
    var modalImg = document.createElement('img');
    overlay.appendChild(modalImg);
    document.body.appendChild(overlay);

    function closeModal() {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    overlay.addEventListener('click', closeModal);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });

    containers.forEach(function (container) {
      var img = container.querySelector('img');
      if (!img) return;
      container.addEventListener('click', function () {
        modalImg.setAttribute('src', img.getAttribute('src'));
        modalImg.setAttribute('alt', img.getAttribute('alt') || '');
        document.body.style.overflow = 'hidden';
        overlay.classList.add('open');
      });
    });
  });
})();
