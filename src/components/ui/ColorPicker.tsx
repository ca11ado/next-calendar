import React, { useEffect, useRef } from 'react';
import { ColorCategory } from '@/lib/utils/colorUtils';

interface ColorPickerProps {
  availableColors: ColorCategory[];
  onSelectColor: (color: string) => void;
  onClose: () => void;
  anchorEl: HTMLElement | null;
}

export function ColorPicker({
  availableColors,
  onSelectColor,
  onClose,
  anchorEl,
}: ColorPickerProps) {
  const pickerRef = useRef<HTMLDivElement>(null);

  // Закрываем при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node) &&
        anchorEl &&
        !anchorEl.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose, anchorEl]);

  // Вычисляем позицию popup'а с умным позиционированием
  const getPosition = () => {
    if (!anchorEl) return { top: 0, left: 0, placement: 'bottom' as const };

    const rect = anchorEl.getBoundingClientRect();
    const popupHeight = 300; // Примерная высота popup (можно уточнить)
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;

    // Определяем, где больше места
    const shouldOpenAbove = spaceBelow < popupHeight && spaceAbove > spaceBelow;

    if (shouldOpenAbove) {
      return {
        top: rect.top - 4, // 4px отступ сверху от квадратика
        left: rect.left,
        placement: 'top' as const,
      };
    }

    return {
      top: rect.bottom + 4, // 4px отступ снизу от квадратика
      left: rect.left,
      placement: 'bottom' as const,
    };
  };

  const position = getPosition();

  // Подсчитываем общее количество цветов
  const totalColors = availableColors.reduce(
    (sum, category) => sum + category.colors.length,
    0
  );

  return (
    <div
      ref={pickerRef}
      className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-3"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform:
          position.placement === 'top' ? 'translateY(-100%)' : undefined,
      }}
    >
      <div className="text-xs font-medium text-gray-700 mb-2">
        Выберите цвет ({totalColors})
      </div>
      <div className="max-h-64 overflow-y-auto space-y-3">
        {availableColors.map((category) => {
          // Для популярных цветов используем 5 колонок, для остальных - 8
          const gridCols =
            category.name === 'Популярные' ? 'grid-cols-5' : 'grid-cols-8';

          return (
            <div key={category.name}>
              <div className="text-[10px] font-medium text-gray-500 mb-1.5">
                {category.name}
              </div>
              <div className={`grid ${gridCols} gap-2`}>
                {category.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      onSelectColor(color);
                      onClose();
                    }}
                    className="w-6 h-6 rounded hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={color}
                    aria-label={`Выбрать цвет ${color}`}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {totalColors === 0 && (
        <div className="text-xs text-gray-500 text-center py-2">
          Нет доступных цветов
        </div>
      )}
    </div>
  );
}
