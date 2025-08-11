// src/utils/mobileVh.ts
export function applyMobileVhVar() {
  const set = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--app-vh', `${vh}px`);
  };
  set();
  window.addEventListener('resize', set, { passive: true });
  window.addEventListener('orientationchange', set, { passive: true });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) set(); });
  return () => {
    window.removeEventListener('resize', set);
    window.removeEventListener('orientationchange', set);
  };
}
