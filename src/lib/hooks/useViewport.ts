import { useState, useEffect } from 'react';

interface ViewportSize {
  width: number;
  height: number;
}

/**
 * Hook для отслеживания размеров viewport с debounce
 * @param debounceMs - задержка в миллисекундах для debounce (по умолчанию 150ms)
 */
export function useViewport(debounceMs: number = 150): ViewportSize {
  const [viewport, setViewport] = useState<ViewportSize>(() => {
    if (typeof window === 'undefined') {
      return { width: 0, height: 0 };
    }
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    let timeoutId: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setViewport({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }, debounceMs);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, [debounceMs]);

  return viewport;
}
