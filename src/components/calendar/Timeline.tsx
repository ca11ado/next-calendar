import React, { useMemo, useState } from 'react';
import {
  GroupingField,
  LifeEvent,
  PositionedEvent,
  YearData,
} from '@/lib/types';
import { LIFE_SPAN_YEARS, HEADER_HEIGHT, FOOTER_HEIGHT } from '@/lib/constants';
import {
  generateYearsLayout,
  calculateYearPositions,
} from '@/lib/utils/layoutEngine';
import { applyPositionsToYears } from '@/lib/utils/positionCalculator';
import { YearRow } from './YearRow';

interface TimelineProps {
  events: LifeEvent[];
  zoomScale: number;
  viewportHeight: number;
  groupingFields: GroupingField[];
  startYear: number;
  onEventClick?: (event: PositionedEvent) => void;
  highlightedLegendItem?: string | null;
}

export function Timeline({
  events,
  zoomScale,
  viewportHeight,
  groupingFields,
  startYear,
  onEventClick,
  highlightedLegendItem,
}: TimelineProps) {
  // Состояние для отслеживания события, на которое наведена мышь
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);

  // Обработчики для hover событий
  const handleEventHover = (eventId: string) => {
    setHoveredEventId(eventId);
  };

  const handleEventLeave = () => {
    setHoveredEventId(null);
  };

  // Вычисляем данные годов с учётом масштаба
  const yearsData = useMemo<YearData[]>(() => {
    // Создаем дату начала из года (используем 1 января)
    const birthDate = new Date(startYear, 0, 1);

    // 1. Генерируем layout для всех годов (группировка и размещение в ряды)
    const layoutData = generateYearsLayout(events, birthDate, LIFE_SPAN_YEARS);

    // 2. Вычисляем доступную высоту (viewport - header - footer)
    const availableHeight = Math.max(
      100,
      viewportHeight - HEADER_HEIGHT - FOOTER_HEIGHT
    );

    // 3. Применяем вертикальные позиции с учётом zoomScale
    const positionedData = calculateYearPositions(
      layoutData,
      availableHeight,
      zoomScale
    );

    // 4. Применяем горизонтальные позиции (startX, width)
    const finalData = applyPositionsToYears(positionedData);

    return finalData;
  }, [events, zoomScale, viewportHeight, startYear]);

  // Вычисляем общую высоту таймлайна
  const totalHeight = useMemo(() => {
    return yearsData.reduce((sum, year) => sum + year.height, 0);
  }, [yearsData]);

  // Вычисляем высоту ряда для передачи в EventBar
  const rowHeight = useMemo(() => {
    if (yearsData.length === 0) return 20;
    // Берём высоту первого года и делим на количество рядов
    const firstYear = yearsData.find((y) => y.rowCount > 0);
    return firstYear ? firstYear.height / firstYear.rowCount : 20;
  }, [yearsData]);

  // Определяем нужен ли скролл
  const needsScroll =
    totalHeight > viewportHeight - HEADER_HEIGHT - FOOTER_HEIGHT;

  // Вычисляем ширину календаря на основе масштаба
  // Пропорции листа A4 (~70% ширины при 100%)
  const calendarWidth = `${Math.min(100, zoomScale * 0.7)}%`;

  return (
    <div
      className={`w-full transition-all duration-300 ${needsScroll ? 'overflow-y-auto' : 'overflow-y-hidden'} flex justify-center`}
      style={{
        height: `${viewportHeight - HEADER_HEIGHT - FOOTER_HEIGHT}px`,
      }}
    >
      <div
        className="transition-all duration-300"
        style={{ height: `${totalHeight}px`, width: calendarWidth }}
      >
        {yearsData.map((yearData) => (
          <YearRow
            key={yearData.year}
            yearData={yearData}
            rowHeight={rowHeight}
            zoomScale={zoomScale}
            groupingFields={groupingFields}
            onEventClick={onEventClick}
            highlightedLegendItem={highlightedLegendItem}
            hoveredEventId={hoveredEventId}
            onEventHover={handleEventHover}
            onEventLeave={handleEventLeave}
          />
        ))}
      </div>
    </div>
  );
}
