import React, { useState, useEffect } from 'react';
import { LifeEvent, EventCategory } from '@/lib/types';
import { CATEGORY_LABELS } from '@/lib/constants';
import { parseDateFromString, formatDateToString } from '@/lib/utils/dateUtils';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

interface EventFormProps {
  event?: LifeEvent; // Для редактирования
  onSubmit: (data: Omit<LifeEvent, 'id'>) => void;
  onCancel: () => void;
}

export function EventForm({ event, onSubmit, onCancel }: EventFormProps) {
  const [title, setTitle] = useState(event?.title || '');
  const [startDate, setStartDate] = useState(
    event?.startDate ? formatDateToString(event.startDate) : ''
  );
  const [endDate, setEndDate] = useState(
    event?.endDate ? formatDateToString(event.endDate) : ''
  );
  const [category, setCategory] = useState<EventCategory>(
    event?.category || 'other'
  );
  const [description, setDescription] = useState(event?.description || '');
  const [isCurrent, setIsCurrent] = useState(
    event ? event.endDate === null : false
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Обновление endDate при изменении isCurrent
  useEffect(() => {
    if (isCurrent) {
      setEndDate('');
    }
  }, [isCurrent]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Название обязательно';
    }

    if (!startDate) {
      newErrors.startDate = 'Дата начала обязательна';
    }

    if (!isCurrent && !endDate) {
      newErrors.endDate =
        'Укажите дату окончания или отметьте "Текущее событие"';
    }

    if (
      startDate &&
      endDate &&
      parseDateFromString(startDate) > parseDateFromString(endDate)
    ) {
      newErrors.endDate = 'Дата окончания не может быть раньше даты начала';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const formData: Omit<LifeEvent, 'id'> = {
      title: title.trim(),
      startDate: parseDateFromString(startDate),
      endDate: isCurrent ? null : parseDateFromString(endDate),
      category,
      description: description.trim() || undefined,
    };

    onSubmit(formData);
  };

  const categoryOptions = Object.entries(CATEGORY_LABELS).map(
    ([value, label]) => ({
      value,
      label,
    })
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Название события"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={errors.title}
        placeholder="Например: Школа №15"
        required
      />

      <Select
        label="Категория"
        value={category}
        onChange={(e) => setCategory(e.target.value as EventCategory)}
        options={categoryOptions}
      />

      <Input
        label="Дата начала"
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        error={errors.startDate}
        required
      />

      <div>
        <label className="flex items-center gap-2 mb-2">
          <input
            type="checkbox"
            checked={isCurrent}
            onChange={(e) => setIsCurrent(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-900">
            Текущее событие (продолжается сейчас)
          </span>
        </label>

        {!isCurrent && (
          <Input
            label="Дата окончания"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            error={errors.endDate}
            required={!isCurrent}
          />
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block mb-1.5 text-sm font-medium text-gray-900"
        >
          Описание (необязательно)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Дополнительная информация о событии"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-gray-900 placeholder:text-gray-500"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Отмена
        </Button>
        <Button type="submit" variant="primary">
          {event ? 'Сохранить' : 'Добавить'}
        </Button>
      </div>
    </form>
  );
}
