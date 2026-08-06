// 플로우 이미지 확대/축소 (react-medium-image-zoom 스타일을 순수 JS로 재현)
//   .flow-image-container.zoomable 요소를 클릭하면 50% 딤드 모달로 "배경 컨테이너 + 이미지"가
//   함께 페이드인 확대됩니다(이미지만 확대되는 게 아니라 배경 프레임도 함께 커짐).
//   모달을 다시 클릭하거나 ESC를 누르면 페이드아웃되며 닫힙니다.
//   커서는 브라우저 네이티브 zoom-in/zoom-out 키워드를 사용 — 대부분의 브라우저에서
//   실제로 "돋보기 + / -" 아이콘으로 렌더링되어 별도 커스텀 커서 이미지가 필요 없습니다.
//   이미지는 object-fit:contain으로 항상 컨테이너 안에 맞춰 축소되므로(넘치는 경우가 없음)
//   별도의 가로 스크롤/드래그 처리는 필요하지 않다.
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

    function openModal(img) {
      modalImg.setAttribute('src', img.getAttribute('src'));
      modalImg.setAttribute('alt', img.getAttribute('alt') || '');
      modalImg.setAttribute('width', img.getAttribute('width') || '');
      modalImg.setAttribute('height', img.getAttribute('height') || '');
      document.body.style.overflow = 'hidden';
      overlay.classList.add('open');
    }

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
        openModal(img);
      });
    });
  });
})();
