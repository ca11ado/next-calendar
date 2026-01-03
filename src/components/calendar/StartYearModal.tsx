import React, { useEffect, useRef } from 'react';
import { LIFE_SPAN_YEARS } from '@/lib/constants';

interface StartYearModalProps {
  currentYear: number;
  startYear: number;
  onSelectYear: (year: number) => void;
  onClose: () => void;
  anchorEl: HTMLElement | null;
}

export function StartYearModal({
  currentYear,
  startYear,
  onSelectYear,
  onClose,
  anchorEl,
}: StartYearModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Закрываем при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
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

  // Генерируем список годов: от (текущий год - 70) до текущего года
  const minYear = currentYear - 70;
  const maxYear = currentYear;
  const years: number[] = [];
  for (let year = maxYear; year >= minYear; year--) {
    years.push(year);
  }

  // Вычисляем позицию popup'а
  const getPosition = () => {
    if (!anchorEl) return { top: 0, left: 0 };

    const rect = anchorEl.getBoundingClientRect();
    return {
      top: rect.bottom + 4,
      left: rect.left,
    };
  };

  const position = getPosition();

  return (
    <div
      ref={modalRef}
      className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-3"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <div className="text-xs font-medium text-gray-700 mb-2">
        Выберите год начала календаря
      </div>
      <div className="max-h-64 overflow-y-auto">
        <div className="space-y-1">
          {years.map((year) => {
            const endYear = year + LIFE_SPAN_YEARS - 1;
            const isSelected = year === startYear;

            return (
              <button
                key={year}
                onClick={() => {
                  onSelectYear(year);
                  onClose();
                }}
                className={`w-full text-left px-3 py-2 text-xs rounded transition-colors ${
                  isSelected
                    ? 'bg-blue-100 text-blue-900 font-semibold'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                {year}–{endYear}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
