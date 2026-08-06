// 플로우 이미지 확대/축소 (react-medium-image-zoom 스타일을 순수 JS로 재현)
//   .flow-image-container.zoomable 요소를 클릭하면 50% 딤드 모달로 "배경 컨테이너 + 이미지"가
//   함께 페이드인 확대됩니다(이미지만 확대되는 게 아니라 배경 프레임도 함께 커짐).
//   모달을 다시 클릭하거나 ESC를 누르면 페이드아웃되며 닫힙니다.
//   커서는 브라우저 네이티브 zoom-in/zoom-out 키워드를 사용 — 대부분의 브라우저에서
//   실제로 "돋보기 + / -" 아이콘으로 렌더링되어 별도 커스텀 커서 이미지가 필요 없습니다.
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var containers = Array.prototype.slice.call(document.querySelectorAll('.flow-image-container.zoomable'));
    if (!containers.length) return;

    var overlay = document.createElement('div');
    overlay.className = 'izm-overlay';
    var modalFrame = document.createElement('div');
    modalFrame.className = 'flow-image-container izm-frame';
    var modalImg = document.createElement('img');
    modalFrame.appendChild(modalImg);
    overlay.appendChild(modalFrame);
    document.body.appendChild(overlay);

    function closeModal() {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    // 가로로 넘치는 플로우 이미지는 마우스로 좌우 드래그해 스크롤 가능.
    // 드래그로 인식되면(임계값 이상 이동) 클릭 콜백(확대/축소)은 취소됨.
    function addDragScroll(el, onClick) {
      var dragging = false, moved = false, startX = 0, startScroll = 0;
      el.addEventListener('mousedown', function (e) {
        if (el.scrollWidth <= el.clientWidth) return;
        dragging = true; moved = false;
        startX = e.pageX; startScroll = el.scrollLeft;
        el.classList.add('dragging');
      });
      window.addEventListener('mousemove', function (e) {
        if (!dragging) return;
        var dx = e.pageX - startX;
        if (Math.abs(dx) > 5) moved = true;
        el.scrollLeft = startScroll - dx;
      });
      window.addEventListener('mouseup', function () {
        dragging = false;
        el.classList.remove('dragging');
      });
      el.addEventListener('click', function (e) {
        if (moved) { moved = false; return; }
        onClick(e);
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });
    addDragScroll(modalFrame, closeModal);

    containers.forEach(function (container) {
      var img = container.querySelector('img');
      if (!img) return;
      addDragScroll(container, function () {
        modalImg.setAttribute('src', img.getAttribute('src'));
        modalImg.setAttribute('alt', img.getAttribute('alt') || '');
        // 인라인 이미지와 동일한 비율(%)을 그대로 사용해 배경 프레임과 이미지가 같은 비율로 확대되게 함
        modalImg.style.width = img.style.width || '';
        document.body.style.overflow = 'hidden';
        overlay.classList.add('open');
      });
    });
  });
})();
