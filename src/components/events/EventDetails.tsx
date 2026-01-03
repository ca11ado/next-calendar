import React from 'react';
import { LifeEvent } from '@/lib/types';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '@/lib/constants';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface EventDetailsProps {
  event: LifeEvent;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function EventDetails({
  event,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: EventDetailsProps) {
  const formatDate = (date: Date) => {
    return format(date, 'd MMMM yyyy', { locale: ru });
  };

  const endDateText = event.endDate
    ? formatDate(event.endDate)
    : 'Настоящее время';

  const categoryColor = event.color || CATEGORY_COLORS[event.category];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={event.title} size="md">
      <div className="space-y-4">
        {/* Цветной индикатор категории */}
        <div className="flex items-center gap-3">
          <div
            className="w-4 h-4 rounded"
            style={{ backgroundColor: categoryColor }}
            aria-hidden="true"
          />
          <span className="text-sm text-gray-600">
            {CATEGORY_LABELS[event.category]}
          </span>
        </div>

        {/* Даты */}
        <div className="space-y-2">
          <div>
            <span className="text-sm font-medium text-gray-700">
              Дата начала:
            </span>
            <p className="text-gray-900">{formatDate(event.startDate)}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-700">
              Дата окончания:
            </span>
            <p className="text-gray-900">{endDateText}</p>
          </div>
        </div>

        {/* Описание */}
        {event.description && (
          <div>
            <span className="text-sm font-medium text-gray-700">Описание:</span>
            <p className="text-gray-900 mt-1 whitespace-pre-wrap">
              {event.description}
            </p>
          </div>
        )}

        {/* Действия */}
        <div className="flex justify-between gap-3 pt-4 border-t border-gray-200">
          <Button variant="danger" onClick={onDelete}>
            Удалить
          </Button>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={onClose}>
              Закрыть
            </Button>
            <Button variant="primary" onClick={onEdit}>
              Редактировать
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
