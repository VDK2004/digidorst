import { useState, useEffect } from 'react';

export function useWakeLock() {
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);

  const requestWakeLock = async () => {
    try {
      if ('wakeLock' in navigator) {
        const wakeLock = await navigator.wakeLock.request('screen');
        setWakeLock(wakeLock);
        
        // Re-request wake lock if page becomes visible again
        const handleVisibilityChange = async () => {
          if (document.visibilityState === 'visible') {
            const newWakeLock = await navigator.wakeLock.request('screen');
            setWakeLock(newWakeLock);
          }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
          document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
      }
    } catch (err) {
      console.error('Failed to request wake lock:', err);
    }
  };

  useEffect(() => {
    requestWakeLock();
    return () => {
      wakeLock?.release().catch(console.error);
    };
  }, []);

  return wakeLock;
}