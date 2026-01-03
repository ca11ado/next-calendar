import React from 'react';
import { ZoomScale } from '@/lib/types';
import { ZOOM_SCALES } from '@/lib/constants';

interface ZoomControlsProps {
  currentZoom: ZoomScale;
  onZoomChange: (zoom: ZoomScale) => void;
}

function getZoomLabel(scale: ZoomScale): string {
  switch (scale) {
    case 50:
      return '1/2';
    case 80:
      return '0.8';
    case 100:
      return '1';
    case 150:
      return 'x1.5';
    case 200:
      return 'x2';
    default:
      return `${scale}%`;
  }
}

export function ZoomControls({ currentZoom, onZoomChange }: ZoomControlsProps) {
  return (
    <div className="space-y-2">
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
        {ZOOM_SCALES.map((scale) => (
          <button
            key={scale}
            onClick={() => onZoomChange(scale)}
            className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
              currentZoom === scale
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            aria-label={`Масштаб ${scale}%`}
            aria-pressed={currentZoom === scale}
          >
            {getZoomLabel(scale)}
          </button>
        ))}
      </div>
      {currentZoom > 100 && (
        <span className="text-xs text-gray-500">(скролл доступен)</span>
      )}
    </div>
  );
}
