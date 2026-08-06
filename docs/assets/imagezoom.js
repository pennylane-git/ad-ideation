// 플로우 미디어(이미지/비디오) 확대·축소 + 비디오 재생/일시정지/재생바
//   .flow-image-container.zoomable 안에는 <img> 또는 <video> 중 하나가 들어있다.
//   컨테이너를 클릭하면 배경 프레임 + 미디어가 함께 확대되어 모달로 열린다(react-medium-image-zoom 스타일).
//   비디오인 경우 좌하단에 재생/일시정지 토글 버튼과 그 옆에 재생바(클릭 시 탐색 가능)가 추가로 붙는다.
//   이 컨트롤들의 클릭은 모두 stopPropagation으로 확대 열기/닫기 동작과 분리되어 있어 서로 간섭하지 않는다.
//   모달을 다시 클릭하거나 ESC를 누르면 닫힌다. 이미지/비디오 모두 object-fit:contain으로 항상
//   컨테이너 안에 맞춰 축소되므로(넘치는 경우가 없음) 별도의 가로 스크롤/드래그 처리는 필요하지 않다.
//
//   주의: img/video를 안 보이게 할 때는 반드시 el.style.display로 직접 제어한다.
//   .hidden(속성) 방식은 ".flow-image-container img, .flow-image-container video{display:block}"
//   같은 author 스타일이 UA 기본 스타일([hidden]{display:none})보다 캐스케이드 우선순위가 높아
//   무시되기 때문에(실제로 빈 박스가 남아있던 버그의 원인) 쓰지 않는다.
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

    // 비디오 하나에 하단 재생바(진행률 표시 + 클릭 탐색)를 붙인다.
    function attachVideoProgress(container, video) {
      var wrap = document.createElement('div');
      wrap.className = 'flow-video-progress-wrap';
      var track = document.createElement('div');
      track.className = 'flow-video-progress';
      var fill = document.createElement('div');
      fill.className = 'flow-video-progress-fill';
      track.appendChild(fill);
      wrap.appendChild(track);
      container.appendChild(wrap);

      function updateFill() {
        if (!video.duration) return;
        var pct = (video.currentTime / video.duration) * 100;
        fill.style.width = pct + '%';
      }
      video.addEventListener('timeupdate', updateFill);
      video.addEventListener('loadedmetadata', updateFill);

      track.addEventListener('click', function (e) {
        e.stopPropagation();
        if (!video.duration) return;
        var rect = track.getBoundingClientRect();
        var ratio = (e.clientX - rect.left) / rect.width;
        ratio = Math.min(1, Math.max(0, ratio));
        video.currentTime = ratio * video.duration;
      });
    }

    // 페이지 안의 각 비디오 컨테이너에 토글 버튼 + 재생바 부착
    containers.forEach(function (container) {
      var video = container.querySelector('video');
      if (video) {
        attachVideoToggle(container, video);
        attachVideoProgress(container, video);
      }
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
    modalVideo.style.display = 'none';
    modalFrame.appendChild(modalImg);
    modalFrame.appendChild(modalVideo);
    overlay.appendChild(modalFrame);
    document.body.appendChild(overlay);
    attachVideoToggle(modalFrame, modalVideo);
    attachVideoProgress(modalFrame, modalVideo);

    function openModal(media) {
      if (media.tagName === 'VIDEO') {
        modalImg.style.display = 'none';
        modalVideo.style.display = 'block';
        modalVideo.setAttribute('width', media.getAttribute('width') || '');
        modalVideo.setAttribute('height', media.getAttribute('height') || '');
        modalVideo.setAttribute('src', media.getAttribute('src') || '');
        modalVideo.play();
      } else {
        modalVideo.style.display = 'none';
        modalVideo.pause();
        modalVideo.removeAttribute('src');
        modalImg.style.display = 'block';
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
