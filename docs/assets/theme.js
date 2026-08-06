// 라이트/다크 모드 토글
//   <html data-theme="light"> 속성 유무로 테마를 구분한다(속성 없음 = 기본값인 다크).
//   깜빡임(FOUC) 방지를 위해 저장된 값을 <head> 맨 위 인라인 스크립트에서 먼저 적용해두므로,
//   이 파일은 버튼 클릭 처리와 아이콘/라벨 갱신만 담당한다.
(function () {
  var STORAGE_KEY = 'da-theme';

  var SUN_SVG = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="6.34" y2="6.34"/><line x1="17.66" y1="17.66" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="6.34" y2="17.66"/><line x1="17.66" y1="6.34" x2="19.07" y2="4.93"/></svg>';
  var MOON_SVG = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;

    function render() {
      var isLight = document.documentElement.getAttribute('data-theme') === 'light';
      // 아이콘은 "누르면 바뀔 모드"를 보여준다: 라이트 모드에서는 달(누르면 다크로),
      // 다크 모드에서는 해(누르면 라이트로) 아이콘을 노출한다.
      btn.innerHTML = isLight ? MOON_SVG : SUN_SVG;
      var label = isLight ? '다크 모드로 전환' : '라이트 모드로 전환';
      btn.setAttribute('aria-label', label);
      btn.setAttribute('title', label);
    }

    render();

    btn.addEventListener('click', function () {
      var isLight = document.documentElement.getAttribute('data-theme') === 'light';
      if (isLight) {
        document.documentElement.removeAttribute('data-theme');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
      }
      try { localStorage.setItem(STORAGE_KEY, isLight ? 'dark' : 'light'); } catch (e) {}
      render();
    });
  });
})();
