import { useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { LifeEvent } from '../types';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEY } from '../constants';

/**
 * Десериализует дату из localStorage
 * Даты хранятся как ISO строки, но мы парсим их как локальные даты
 */
function deserializeDate(dateValue: unknown): Date | null {
  if (dateValue === null) return null;
  if (dateValue instanceof Date) return dateValue;

  if (typeof dateValue === 'string') {
    // Парсим ISO string, извлекая компоненты даты
    const isoMatch = dateValue.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
      const [, year, month, day] = isoMatch;
      return new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        0,
        0,
        0,
        0
      );
    }
  }

  return null;
}

interface UseEventsReturn {
  events: LifeEvent[];
  addEvent: (event: Omit<LifeEvent, 'id'>) => void;
  updateEvent: (id: string, updates: Partial<Omit<LifeEvent, 'id'>>) => void;
  deleteEvent: (id: string) => void;
  setEvents: (events: LifeEvent[]) => void;
  clearAllEvents: () => void;
}

/**
 * Hook для управления событиями с автоматическим сохранением в localStorage
 */
export function useEvents(): UseEventsReturn {
  const [rawEvents, setRawEvents] = useLocalStorage<LifeEvent[]>(
    STORAGE_KEY,
    []
  );

  // Преобразуем даты из строк в Date объекты при загрузке из localStorage
  const events = useMemo(() => {
    return rawEvents.map((event) => ({
      ...event,
      startDate: deserializeDate(event.startDate) || new Date(),
      endDate: deserializeDate(event.endDate),
    }));
  }, [rawEvents]);

  // Wrapper для setEvents который работает с rawEvents
  const setEvents = useCallback(
    (value: LifeEvent[] | ((prev: LifeEvent[]) => LifeEvent[])) => {
      setRawEvents(value);
    },
    [setRawEvents]
  );

  /**
   * Добавляет новое событие
   */
  const addEvent = useCallback(
    (event: Omit<LifeEvent, 'id'>) => {
      const newEvent: LifeEvent = {
        ...event,
        id: uuidv4(),
      };

      setRawEvents((prevEvents) => [...prevEvents, newEvent]);
    },
    [setRawEvents]
  );

  /**
   * Обновляет существующее событие
   */
  const updateEvent = useCallback(
    (id: string, updates: Partial<Omit<LifeEvent, 'id'>>) => {
      setRawEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === id ? { ...event, ...updates } : event
        )
      );
    },
    [setRawEvents]
  );

  /**
   * Удаляет событие по ID
   */
  const deleteEvent = useCallback(
    (id: string) => {
      setRawEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== id)
      );
    },
    [setRawEvents]
  );

  /**
   * Очищает все события
   */
  const clearAllEvents = useCallback(() => {
    setRawEvents([]);
  }, [setRawEvents]);

  return {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    setEvents,
    clearAllEvents,
  };
}
