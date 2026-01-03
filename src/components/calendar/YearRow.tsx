import React from 'react';
import { GroupingField, PositionedEvent, YearData } from '@/lib/types';
import { EventBar } from './EventBar';
import { TimeGrid } from './TimeGrid';

interface YearRowProps {
  yearData: YearData;
  rowHeight: number;
  zoomScale: number;
  groupingFields: GroupingField[];
  onEventClick?: (event: PositionedEvent) => void;
  highlightedLegendItem?: string | null;
  hoveredEventId?: string | null;
  onEventHover?: (eventId: string) => void;
  onEventLeave?: () => void;
}

export function YearRow({
  yearData,
  rowHeight,
  zoomScale,
  groupingFields,
  onEventClick,
  highlightedLegendItem,
  hoveredEventId,
  onEventHover,
  onEventLeave,
}: YearRowProps) {
  const { year, events, height, rowCount } = yearData;

  // При масштабе 50% уменьшаем шрифт
  const isCompact = zoomScale === 50;
  const fontSize = isCompact ? 'text-[6px]' : 'text-[8px]';

  return (
    <div
      className="flex transition-all duration-300 overflow-visible"
      style={{ height: `${height}px` }}
    >
      {/* Метка года */}
      <div className="flex-shrink-0 w-24 flex items-center justify-center bg-gray-50 overflow-visible">
        <span
          className={`${fontSize} font-normal text-gray-600 whitespace-nowrap`}
        >
          {year}
        </span>
      </div>

      {/* Область событий */}
      <div className="flex-1 relative bg-white">
        {/* Временная сетка в фоне */}
        <TimeGrid zoomScale={zoomScale} />

        {/* Фоновые блоки для всех строк (светло-серые) с 1px gap */}
        {Array.from({ length: rowCount }).map((_, rowIndex) => (
          <div
            key={`row-bg-${rowIndex}`}
            className="absolute w-full bg-gray-100"
            style={{
              top: `${rowIndex * rowHeight}px`,
              height: `${rowHeight - 1}px`,
              left: 0,
              right: 0,
            }}
          />
        ))}

        {/* События поверх сетки и фона */}
        {events.map((event) => (
          <EventBar
            key={event.id}
            event={event}
            rowHeight={rowHeight}
            zoomScale={zoomScale}
            groupingFields={groupingFields}
            onClick={onEventClick}
            highlightedLegendItem={highlightedLegendItem}
            hoveredEventId={hoveredEventId}
            onEventHover={onEventHover}
            onEventLeave={onEventLeave}
          />
        ))}
      </div>
    </div>
  );
}
