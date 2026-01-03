import { useState, useCallback, useEffect } from 'react';
import { ZoomScale } from '../types';
import {
  DEFAULT_ZOOM_SCALE,
  ZOOM_SCALES,
  STORAGE_KEY_ZOOM,
} from '../constants';

interface UseZoomReturn {
  zoomScale: ZoomScale;
  setZoomScale: (scale: ZoomScale) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
}

/**
 * Hook для управления масштабом календаря (50%/80%/100%/150%/200%)
 */
export function useZoom(): UseZoomReturn {
  const [zoomScale, setZoomScale] = useState<ZoomScale>(DEFAULT_ZOOM_SCALE);

  // Загружаем сохраненное значение при монтировании
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ZOOM);
    if (saved) {
      const scale = parseInt(saved, 10);
      if (!isNaN(scale) && ZOOM_SCALES.includes(scale as ZoomScale)) {
        setZoomScale(scale as ZoomScale);
      }
    }
  }, []);

  // Сохраняем при изменении
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ZOOM, zoomScale.toString());
  }, [zoomScale]);

  /**
   * Увеличивает масштаб размера
   */
  const zoomIn = useCallback(() => {
    setZoomScale((current) => {
      const currentIndex = ZOOM_SCALES.indexOf(current);
      if (currentIndex < ZOOM_SCALES.length - 1) {
        return ZOOM_SCALES[currentIndex + 1];
      }
      return current;
    });
  }, []);

  /**
   * Уменьшает масштаб размера
   */
  const zoomOut = useCallback(() => {
    setZoomScale((current) => {
      const currentIndex = ZOOM_SCALES.indexOf(current);
      if (currentIndex > 0) {
        return ZOOM_SCALES[currentIndex - 1];
      }
      return current;
    });
  }, []);

  /**
   * Сбрасывает масштаб к значению по умолчанию
   */
  const resetZoom = useCallback(() => {
    setZoomScale(DEFAULT_ZOOM_SCALE);
  }, []);

  return {
    zoomScale,
    setZoomScale,
    zoomIn,
    zoomOut,
    resetZoom,
  };
}
