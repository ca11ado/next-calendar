import React from 'react';
import { PositionedEvent } from '@/lib/types';
import { CATEGORY_LABELS } from '@/lib/constants';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface EventTooltipProps {
  event: PositionedEvent;
  position: { x: number; y: number };
}

export function EventTooltip({ event, position }: EventTooltipProps) {
  const formatDate = (date: Date) => {
    return format(date, 'd MMMM yyyy', { locale: ru });
  };

  const endDateText = event.endDate
    ? formatDate(event.endDate)
    : 'Настоящее время';

  return (
    <div
      className="fixed z-50 bg-gray-900 text-white rounded-lg shadow-xl px-4 py-3 max-w-sm pointer-events-none"
      style={{
        left: `${position.x + 10}px`,
        top: `${position.y + 10}px`,
      }}
    >
      <div className="font-semibold text-sm mb-1">{event.title}</div>
      <div className="text-xs text-gray-300 space-y-0.5">
        <div>
          <span className="text-gray-400">Категория:</span>{' '}
          {CATEGORY_LABELS[event.category]}
        </div>
        <div>
          <span className="text-gray-400">Начало:</span>{' '}
          {formatDate(event.startDate)}
        </div>
        <div>
          <span className="text-gray-400">Конец:</span> {endDateText}
        </div>
        {event.description && (
          <div className="mt-2 pt-2 border-t border-gray-700">
            {event.description}
          </div>
        )}
      </div>
    </div>
  );
}
