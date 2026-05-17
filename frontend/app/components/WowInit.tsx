import { useEffect } from 'react';
import { useLocation } from 'react-router';

export default function WowInit() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const WOW = (window as any).WOW;
    if (!WOW) return;

    try {
      new WOW().init();
    } catch (e) {
      console.warn('WOW init failed:', e);
    }
  }, [location.pathname]);

  return null;
}
