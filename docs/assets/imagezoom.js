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

      // 가로로 넘치는 플로우 이미지는 마우스로 좌우 드래그해 스크롤 가능.
      // 드래그로 인식되면(임계값 이상 이동) 클릭 확대는 취소됨.
      var dragging = false, dragMoved = false, startX = 0, startScroll = 0;
      container.addEventListener('mousedown', function (e) {
        if (container.scrollWidth <= container.clientWidth) return;
        dragging = true; dragMoved = false;
        startX = e.pageX; startScroll = container.scrollLeft;
        container.classList.add('dragging');
      });
      window.addEventListener('mousemove', function (e) {
        if (!dragging) return;
        var dx = e.pageX - startX;
        if (Math.abs(dx) > 5) dragMoved = true;
        container.scrollLeft = startScroll - dx;
      });
      window.addEventListener('mouseup', function () {
        dragging = false;
        container.classList.remove('dragging');
      });

      container.addEventListener('click', function () {
        if (dragMoved) { dragMoved = false; return; }
        modalImg.setAttribute('src', img.getAttribute('src'));
        modalImg.setAttribute('alt', img.getAttribute('alt') || '');
        document.body.style.overflow = 'hidden';
        overlay.classList.add('open');
      });
    });
  });
})();
