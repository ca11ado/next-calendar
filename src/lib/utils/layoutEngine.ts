import { LifeEvent, PositionedEvent, YearData, EventSegment } from '../types';
import { getYearFromDate, getEventEndDate } from './dateUtils';

/**
 * Создает сегмент события для конкретного года
 * Обрезает даты по границам года
 */
function createEventSegmentForYear(event: LifeEvent, year: number): LifeEvent {
  const yearStart = new Date(year, 0, 1); // 1 января
  const yearEnd = new Date(year, 11, 31, 23, 59, 59); // 31 декабря

  const eventEnd = getEventEndDate(event.endDate);

  // Обрезаем startDate и endDate по границам года
  const segmentStart =
    event.startDate > yearStart ? event.startDate : yearStart;
  const segmentEnd = eventEnd < yearEnd ? eventEnd : yearEnd;

  return {
    ...event,
    startDate: segmentStart,
    endDate:
      event.endDate === null && year === getYearFromDate(eventEnd)
        ? null // Сохраняем null только для последнего года текущего события
        : segmentEnd,
  };
}

/**
 * Группирует события по годам, создавая сегменты для многолетних событий
 * Каждое событие, которое длится несколько лет, будет представлено в каждом году
 */
function groupEventsByYear(events: LifeEvent[]): Map<number, LifeEvent[]> {
  const grouped = new Map<number, LifeEvent[]>();

  events.forEach((event) => {
    const startYear = getYearFromDate(event.startDate);
    const endDate = getEventEndDate(event.endDate);
    const endYear = getYearFromDate(endDate);

    // Создаём сегмент события для каждого года от начала до конца
    for (let year = startYear; year <= endYear; year++) {
      if (!grouped.has(year)) {
        grouped.set(year, []);
      }

      const segment = createEventSegmentForYear(event, year);
      grouped.get(year)!.push(segment);
    }
  });

  return grouped;
}

/**
 * Проверяет, перекрываются ли два события по времени
 */
function eventsOverlap(event1: LifeEvent, event2: LifeEvent): boolean {
  const end1 = getEventEndDate(event1.endDate);
  const end2 = getEventEndDate(event2.endDate);

  return event1.startDate <= end2 && event2.startDate <= end1;
}

/**
 * Временная точка изменения (начало или конец события)
 */
interface TimePoint {
  date: Date;
  type: 'start' | 'end';
  event: LifeEvent;
}

/**
 * Сегмент года с информацией об активных событиях
 */
interface YearSegmentInfo {
  startDate: Date;
  endDate: Date;
  startX: number; // позиция начала в процентах года
  width: number; // ширина в процентах года
  activeEvents: LifeEvent[]; // события, активные в этом сегменте
}

/**
 * Создает сегменты года на основе точек начала/конца событий
 * Каждый сегмент имеет фиксированный набор активных событий
 */
function createYearSegments(
  events: LifeEvent[],
  year: number
): YearSegmentInfo[] {
  const yearStart = new Date(year, 0, 1);
  const yearEnd = new Date(year, 11, 31, 23, 59, 59);

  // Собираем все точки начала и конца событий
  const timePoints: TimePoint[] = [];

  events.forEach((event) => {
    const eventEnd = getEventEndDate(event.endDate);

    // Добавляем точку начала (если в пределах года)
    if (event.startDate >= yearStart && event.startDate <= yearEnd) {
      timePoints.push({ date: event.startDate, type: 'start', event });
    }

    // Добавляем точку конца (если в пределах года и это не последний день года)
    // Если событие заканчивается 31 декабря, не добавляем точку - пусть идет до конца года
    const eventEndYear = eventEnd.getFullYear();
    const eventEndMonth = eventEnd.getMonth();
    const eventEndDate = eventEnd.getDate();
    const isLastDayOfYear =
      eventEndYear === year && eventEndMonth === 11 && eventEndDate === 31;

    if (
      eventEnd >= yearStart &&
      eventEnd <= yearEnd &&
      !isLastDayOfYear &&
      eventEnd < yearEnd
    ) {
      timePoints.push({ date: eventEnd, type: 'end', event });
    }
  });

  // Сортируем точки по времени
  timePoints.sort((a, b) => a.date.getTime() - b.date.getTime());

  // Создаем сегменты между точками
  const segments: YearSegmentInfo[] = [];
  const activeEvents = new Set<LifeEvent>();

  // Инициализируем активные события (те, что начались до года)
  events.forEach((event) => {
    const eventEnd = getEventEndDate(event.endDate);
    if (event.startDate < yearStart && eventEnd >= yearStart) {
      activeEvents.add(event);
    }
  });

  let currentDate = yearStart;

  timePoints.forEach((point) => {
    // Создаем сегмент от текущей даты до этой точки
    if (point.date > currentDate && activeEvents.size > 0) {
      const startX = getDatePositionInYear(currentDate, year);
      const endX = getDatePositionInYear(point.date, year);

      segments.push({
        startDate: currentDate,
        endDate: point.date,
        startX,
        width: endX - startX,
        activeEvents: Array.from(activeEvents),
      });
    }

    // Обновляем набор активных событий
    if (point.type === 'start') {
      activeEvents.add(point.event);
    } else {
      activeEvents.delete(point.event);
    }

    currentDate = point.date;
  });

  // Добавляем последний сегмент до конца года
  if (activeEvents.size > 0) {
    const startX = getDatePositionInYear(currentDate, year);
    segments.push({
      startDate: currentDate,
      endDate: yearEnd,
      startX,
      width: 100 - startX,
      activeEvents: Array.from(activeEvents),
    });
  }

  return segments;
}

/**
 * Вычисляет позицию даты в году в процентах (0-100)
 */
function getDatePositionInYear(date: Date, year: number): number {
  const yearStart = new Date(year, 0, 1).getTime();
  const yearEnd = new Date(year, 11, 31, 23, 59, 59).getTime();
  const dateTime = date.getTime();

  // Ограничиваем позицию пределами года
  const clampedTime = Math.max(yearStart, Math.min(yearEnd, dateTime));
  const position = ((clampedTime - yearStart) / (yearEnd - yearStart)) * 100;

  return Math.max(0, Math.min(100, position));
}

/**
 * Размещает события года для view-a режима с динамической высотой
 * Создает сегменты, где события могут иметь разную высоту в зависимости от количества перекрытий
 */
function assignRowsToYearEventsViewA(
  events: LifeEvent[],
  year: number
): PositionedEvent[] {
  if (events.length === 0) return [];

  // Создаем сегменты года
  const yearSegments = createYearSegments(events, year);

  // Карта: событие -> его сегменты
  const eventSegmentsMap = new Map<string, EventSegment[]>();

  // Обрабатываем каждый сегмент года
  yearSegments.forEach((segment) => {
    // Размещаем активные события сегмента по подрядам
    const sortedSegmentEvents = [...segment.activeEvents].sort(
      (a, b) => a.startDate.getTime() - b.startDate.getTime()
    );

    const subRows: { events: LifeEvent[] }[] = [];
    const eventSubRowMap = new Map<string, number>();

    // Сначала размещаем все события и запоминаем их подряды
    sortedSegmentEvents.forEach((event) => {
      // Ищем первый подряд, где событие не будет перекрываться
      let assignedSubRow = -1;

      for (let subRowIndex = 0; subRowIndex < subRows.length; subRowIndex++) {
        const subRowEvents = subRows[subRowIndex].events;
        const hasOverlap = subRowEvents.some((existingEvent) =>
          eventsOverlap(existingEvent, event)
        );

        if (!hasOverlap) {
          assignedSubRow = subRowIndex;
          break;
        }
      }

      // Если не нашли свободный подряд, создаём новый
      if (assignedSubRow === -1) {
        assignedSubRow = subRows.length;
        subRows.push({ events: [] });
      }

      subRows[assignedSubRow].events.push(event);
      eventSubRowMap.set(event.id, assignedSubRow);
    });

    // Теперь добавляем сегменты с финальным значением totalSubRows
    const finalTotalSubRows = subRows.length;

    sortedSegmentEvents.forEach((event) => {
      const assignedSubRow = eventSubRowMap.get(event.id)!;

      if (!eventSegmentsMap.has(event.id)) {
        eventSegmentsMap.set(event.id, []);
      }

      eventSegmentsMap.get(event.id)!.push({
        startX: segment.startX,
        width: segment.width,
        subRow: assignedSubRow,
        totalSubRows: finalTotalSubRows,
      });
    });
  });

  // Создаем позиционированные события с сегментами
  const positionedEvents: PositionedEvent[] = events.map((event) => {
    const segments = eventSegmentsMap.get(event.id) || [];

    // Вычисляем общие startX и width для обратной совместимости
    const startX = segments.length > 0 ? segments[0].startX : 0;
    const endX =
      segments.length > 0
        ? segments[segments.length - 1].startX +
          segments[segments.length - 1].width
        : 0;
    const width = endX - startX;

    // Для обратной совместимости берем subRow и totalSubRows из первого сегмента
    const firstSegment = segments[0];

    return {
      ...event,
      row: 0, // Все события в одном ряду
      startX,
      width,
      subRow: firstSegment?.subRow,
      totalSubRows: firstSegment?.totalSubRows,
      segments, // Массив сегментов для динамической высоты
    };
  });

  return positionedEvents;
}

/**
 * Генерирует данные для всех годов между birthDate и birthDate + lifeSpanYears
 * Включая годы без событий
 */
export function generateYearsLayout(
  events: LifeEvent[],
  birthDate: Date,
  lifeSpanYears: number
): YearData[] {
  const startYear = getYearFromDate(birthDate);
  const endYear = startYear + lifeSpanYears - 1;

  // Группируем события по годам
  const eventsByYear = groupEventsByYear(events);

  // Создаём данные для каждого года
  const yearsData: YearData[] = [];

  for (let year = startYear; year <= endYear; year++) {
    const yearEvents = eventsByYear.get(year) || [];
    let positionedEvents: PositionedEvent[] = [];
    let rowCount = 1;

    if (yearEvents.length > 0) {
      positionedEvents = assignRowsToYearEventsViewA(yearEvents, year);
      rowCount = 1; // Всегда один ряд на год
    }

    yearsData.push({
      year,
      events: positionedEvents,
      rowCount,
      height: 0, // будет вычислено позже на основе zoomScale
      yOffset: 0, // будет вычислено позже на основе высот предыдущих годов
    });
  }

  return yearsData;
}

/**
 * Вычисляет вертикальные позиции годов на основе доступной высоты и масштаба
 */
export function calculateYearPositions(
  yearsData: YearData[],
  availableHeight: number,
  zoomScale: number
): YearData[] {
  // Вычисляем общее количество рядов
  const totalRows = yearsData.reduce((sum, year) => sum + year.rowCount, 0);

  // Базовая высота ряда - когда все годы влезают на экран (100%)
  const baseRowHeight = availableHeight / totalRows;

  // Применяем масштаб (100% = всё на экране, 200% = удвоенная высота с прокруткой)
  const actualRowHeight = baseRowHeight * (zoomScale / 100);

  let currentYOffset = 0;

  return yearsData.map((year) => {
    const yearHeight = year.rowCount * actualRowHeight;

    const updatedYear: YearData = {
      ...year,
      height: yearHeight,
      yOffset: currentYOffset,
    };

    currentYOffset += yearHeight;

    return updatedYear;
  });
}
