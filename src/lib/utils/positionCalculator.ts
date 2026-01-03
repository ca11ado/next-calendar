import { PositionedEvent, YearData } from '../types';
import {
  getDayOfYear,
  getDaysInYear,
  getDaysBetween,
  getEventEndDate,
  getYearFromDate,
  getEndOfYear,
} from './dateUtils';
import { MIN_EVENT_WIDTH } from '../constants';

/**
 * Вычисляет горизонтальную позицию и ширину события в процентах
 * относительно ширины года
 */
export function calculateEventPosition(
  event: PositionedEvent,
  year: number
): { startX: number; width: number } {
  const daysInYear = getDaysInYear(year);
  const eventStartYear = getYearFromDate(event.startDate);

  // Если событие начинается в текущем году
  if (eventStartYear === year) {
    const dayOfYear = getDayOfYear(event.startDate);
    const startX = ((dayOfYear - 1) / daysInYear) * 100;

    // Вычисляем ширину
    const eventEnd = getEventEndDate(event.endDate);
    const eventEndYear = getYearFromDate(eventEnd);

    let width: number;

    if (eventEndYear === year) {
      // Событие начинается и заканчивается в этом году
      const duration = getDaysBetween(event.startDate, eventEnd);
      width = (duration / daysInYear) * 100;
    } else {
      // Событие продолжается в следующий год
      const yearEnd = getEndOfYear(event.startDate);
      const duration = getDaysBetween(event.startDate, yearEnd);
      width = (duration / daysInYear) * 100;
    }

    // Применяем минимальную ширину для видимости
    width = Math.max(width, MIN_EVENT_WIDTH);

    return { startX, width };
  }

  // Событие началось в предыдущем году и продолжается в текущем
  // (не должно происходить при текущем алгоритме, но на всякий случай)
  return { startX: 0, width: MIN_EVENT_WIDTH };
}

/**
 * Применяет вычисленные позиции ко всем событиям во всех годах
 */
export function applyPositionsToYears(yearsData: YearData[]): YearData[] {
  return yearsData.map((yearData) => ({
    ...yearData,
    events: yearData.events.map((event) => {
      const { startX, width } = calculateEventPosition(event, yearData.year);
      return {
        ...event,
        startX,
        width,
      };
    }),
  }));
}
