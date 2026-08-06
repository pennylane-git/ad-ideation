// 플로우 미디어(이미지/비디오) 확대·축소 + 비디오 재생/일시정지
//   .flow-image-container.zoomable 안에는 <img> 또는 <video> 중 하나가 들어있다.
//   컨테이너를 클릭하면 배경 프레임 + 미디어가 함께 확대되어 모달로 열린다(react-medium-image-zoom 스타일).
//   비디오인 경우 컨테이너 좌하단에 재생/일시정지 토글 버튼이 추가로 붙는다 — 이 버튼 클릭은
//   stopPropagation으로 확대 열기 동작과 분리되어 있어 재생 제어와 확대가 서로 간섭하지 않는다.
//   모달을 다시 클릭하거나 ESC를 누르면 닫힌다. 이미지/비디오 모두 object-fit:contain으로 항상
//   컨테이너 안에 맞춰 축소되므로(넘치는 경우가 없음) 별도의 가로 스크롤/드래그 처리는 필요하지 않다.
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var containers = Array.prototype.slice.call(document.querySelectorAll('.flow-image-container.zoomable'));

    var PLAY_SVG = '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20"/></svg>';
    var PAUSE_SVG = '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="4" width="5" height="16"/><rect x="14" y="4" width="5" height="16"/></svg>';

    // 비디오 하나에 재생/일시정지 토글 버튼을 붙인다(컨테이너 클릭=확대와는 별개로 동작).
    function attachVideoToggle(container, video) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'flow-video-toggle';
      btn.innerHTML = PAUSE_SVG;
      btn.setAttribute('aria-label', '일시정지');
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (video.paused) { video.play(); } else { video.pause(); }
      });
      video.addEventListener('play', function () {
        btn.innerHTML = PAUSE_SVG;
        btn.setAttribute('aria-label', '일시정지');
      });
      video.addEventListener('pause', function () {
        btn.innerHTML = PLAY_SVG;
        btn.setAttribute('aria-label', '재생');
      });
      container.appendChild(btn);
      return btn;
    }

    // 페이지 안의 각 비디오 컨테이너에 토글 버튼 부착
    containers.forEach(function (container) {
      var video = container.querySelector('video');
      if (video) attachVideoToggle(container, video);
    });

    if (!containers.length) return;

    // ---- 확대 모달(이미지/비디오 공용 프레임) ----
    var overlay = document.createElement('div');
    overlay.className = 'izm-overlay';
    var modalFrame = document.createElement('div');
    modalFrame.className = 'flow-image-container izm-frame';
    var modalImg = document.createElement('img');
    var modalVideo = document.createElement('video');
    modalVideo.muted = true;
    modalVideo.loop = true;
    modalVideo.playsInline = true;
    modalVideo.hidden = true;
    modalFrame.appendChild(modalImg);
    modalFrame.appendChild(modalVideo);
    overlay.appendChild(modalFrame);
    document.body.appendChild(overlay);
    attachVideoToggle(modalFrame, modalVideo);

    function openModal(media) {
      if (media.tagName === 'VIDEO') {
        modalImg.hidden = true;
        modalVideo.hidden = false;
        modalVideo.setAttribute('width', media.getAttribute('width') || '');
        modalVideo.setAttribute('height', media.getAttribute('height') || '');
        modalVideo.setAttribute('src', media.getAttribute('src') || '');
        modalVideo.play();
      } else {
        modalVideo.hidden = true;
        modalVideo.pause();
        modalVideo.removeAttribute('src');
        modalImg.hidden = false;
        modalImg.setAttribute('src', media.getAttribute('src'));
        modalImg.setAttribute('alt', media.getAttribute('alt') || '');
        modalImg.setAttribute('width', media.getAttribute('width') || '');
        modalImg.setAttribute('height', media.getAttribute('height') || '');
      }
      document.body.style.overflow = 'hidden';
      overlay.classList.add('open');
    }

    function closeModal() {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
      modalVideo.pause();
    }

    overlay.addEventListener('click', closeModal);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });

    containers.forEach(function (container) {
      var media = container.querySelector('img, video');
      if (!media) return;
      container.addEventListener('click', function () {
        openModal(media);
      });
    });
  });
})();
