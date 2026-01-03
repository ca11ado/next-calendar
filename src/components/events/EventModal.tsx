import React from 'react';
import { LifeEvent } from '@/lib/types';
import { Modal } from '@/components/ui/Modal';
import { EventForm } from './EventForm';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: LifeEvent; // Для редактирования
  onSubmit: (data: Omit<LifeEvent, 'id'>) => void;
}

export function EventModal({
  isOpen,
  onClose,
  event,
  onSubmit,
}: EventModalProps) {
  const handleSubmit = (data: Omit<LifeEvent, 'id'>) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={event ? 'Редактировать событие' : 'Добавить событие'}
      size="md"
    >
      <EventForm event={event} onSubmit={handleSubmit} onCancel={onClose} />
    </Modal>
  );
}
