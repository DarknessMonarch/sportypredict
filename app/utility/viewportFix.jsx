export const initViewportFix = () => {
  if (typeof window === 'undefined') return;

  const setViewportUnits = () => {
    const vh = window.innerHeight * 0.01;
    const vw = window.innerWidth * 0.01;
    
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    document.documentElement.style.setProperty('--vw', `${vw}px`);
    document.documentElement.style.setProperty('--real-10vw', `${vw * 10}px`);
    document.documentElement.style.setProperty('--real-9vh', `${vh * 9}px`);
    document.documentElement.style.setProperty('--real-10vh', `${vh * 10}px`);
  };

  setViewportUnits();

  let resizeTimer;
  const handleResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(setViewportUnits, 100);
  };

  const handleOrientationChange = () => {
    setTimeout(setViewportUnits, 500); 
  };

  window.addEventListener('resize', handleResize);
  window.addEventListener('orientationchange', handleOrientationChange);
  
  let scrollTimer;
  const handleScroll = () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(setViewportUnits, 150);
  };
  
  if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  return () => {
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('orientationchange', handleOrientationChange);
    window.removeEventListener('scroll', handleScroll);
    clearTimeout(resizeTimer);
    clearTimeout(scrollTimer);
  };
};