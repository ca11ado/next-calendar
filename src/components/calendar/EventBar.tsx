import React, { useState } from 'react';
import { GroupingField, PositionedEvent, ZoomScale } from '@/lib/types';
import {
  getConsistentColor,
  generateGroupingKey,
  isLightColor,
} from '@/lib/utils/colorUtils';
import { getEventFontConfig } from '@/lib/utils/fontConfigUtils';
import { EVENT_TEXT_COLOR_CONFIG } from '@/lib/constants';
import { EventTooltip } from './EventTooltip';

interface EventBarProps {
  event: PositionedEvent;
  rowHeight: number;
  zoomScale: number;
  groupingFields: GroupingField[];
  onClick?: (event: PositionedEvent) => void;
  highlightedLegendItem?: string | null;
  hoveredEventId?: string | null;
  onEventHover?: (eventId: string) => void;
  onEventLeave?: () => void;
}

export function EventBar({
  event,
  rowHeight,
  zoomScale,
  groupingFields,
  onClick,
  highlightedLegendItem,
  hoveredEventId,
  onEventHover,
  onEventLeave,
}: EventBarProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Проверяем, наведена ли мышь на это событие
  const isHovered = hoveredEventId === event.id;

  // Получаем конфигурацию шрифта для текущего масштаба
  const fontConfig = getEventFontConfig(zoomScale as ZoomScale);

  // Вычисляем масштаб шрифта на основе количества подрядов
  const getFontScale = (): number => {
    if (event.totalSubRows && event.totalSubRows > 1) {
      // Уменьшаем шрифт пропорционально количеству подрядов
      // Но не меньше чем до 0.3 (30%), чтобы текст был читаемым
      return Math.max(0.3, 1 / event.totalSubRows);
    }
    return 1;
  };

  const fontScale = getFontScale();

  // Генерируем ключ группировки и получаем цвет
  const groupingKey = generateGroupingKey(event, groupingFields);
  const baseColor = event.color || getConsistentColor(groupingKey);

  // Определяем цвет текста на основе яркости фона
  const textColorConfig = isLightColor(baseColor)
    ? EVENT_TEXT_COLOR_CONFIG.light
    : EVENT_TEXT_COLOR_CONFIG.dark;

  // Проверяем, соответствует ли событие подсвеченному элементу легенды
  const isHighlighted = highlightedLegendItem
    ? groupingKey === highlightedLegendItem
    : false;

  const handleMouseEnter = (e: React.MouseEvent) => {
    setShowTooltip(true);
    setTooltipPosition({ x: e.clientX, y: e.clientY });
    if (onEventHover) {
      onEventHover(event.id);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setTooltipPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
    if (onEventLeave) {
      onEventLeave();
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick(event);
    }
  };

  // Вычисляем стили события
  const getEventStyles = () => {
    let heightValue: number;
    let topValue: number;

    if (event.totalSubRows && event.subRow !== undefined) {
      // События делят высоту строки
      const subRowHeight = rowHeight / event.totalSubRows;
      heightValue = subRowHeight - 1; // 1px gap между подрядами
      topValue = event.row * rowHeight + event.subRow * subRowHeight;
    } else {
      // Fallback если нет subRow
      heightValue = rowHeight - 1;
      topValue = event.row * rowHeight;
    }

    return {
      left: `${event.startX}%`,
      width: `${event.width}%`,
      top: `${topValue}px`,
      height: `${heightValue}px`,
      backgroundColor: baseColor,
      minWidth: '2px',
      border: 'none',
      boxShadow: isHighlighted
        ? '0 0 12px 3px rgba(59, 130, 246, 0.6)'
        : 'none',
      filter: isHighlighted
        ? 'brightness(1.2)'
        : isHovered
          ? 'brightness(1.1)'
          : undefined,
      zIndex: isHighlighted ? 50 : isHovered ? 40 : undefined,
    };
  };

  const eventStyles = getEventStyles();

  // Рендер сегментов с динамической высотой
  if (event.segments && event.segments.length > 0) {
    return (
      <>
        {event.segments.map((segment, index) => {
          const subRowHeight = rowHeight / segment.totalSubRows;
          const segmentHeight = subRowHeight - 1; // 1px gap
          const segmentTop =
            event.row * rowHeight + segment.subRow * subRowHeight;

          // Вычисляем масштаб шрифта для этого сегмента
          const segmentFontScale =
            segment.totalSubRows > 1
              ? Math.max(0.3, 1 / segment.totalSubRows)
              : 1;

          const segmentStyles = {
            left: `${segment.startX}%`,
            width: `${segment.width}%`,
            top: `${segmentTop}px`,
            height: `${segmentHeight}px`,
            backgroundColor: baseColor,
            minWidth: '2px',
            border: 'none',
            boxShadow: isHighlighted
              ? '0 0 12px 3px rgba(59, 130, 246, 0.6)'
              : isHovered
                ? '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                : 'none',
            filter: isHighlighted
              ? 'brightness(1.2)'
              : isHovered
                ? 'brightness(1.1)'
                : undefined,
            zIndex: isHighlighted ? 50 : isHovered ? 40 : undefined,
          };

          return (
            <div
              key={`${event.id}-segment-${index}`}
              className={`absolute rounded-none transition-all duration-300 cursor-pointer`}
              style={segmentStyles}
              onMouseEnter={handleMouseEnter}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              role="button"
              tabIndex={0}
              aria-label={`${event.title}`}
            >
              {/* Текст события */}
              {segment.width > 2 && (
                <div className="absolute inset-0 flex items-center">
                  <span
                    className={`truncate ${textColorConfig.className} font-medium ${fontConfig.fontSize} ${fontConfig.padding} ${fontConfig.lineHeight || ''}`}
                    style={{
                      paddingLeft: fontConfig.paddingLeft || '4px',
                      transform:
                        segmentFontScale !== 1
                          ? `scale(${segmentFontScale})`
                          : undefined,
                      transformOrigin: 'left center',
                    }}
                  >
                    {event.title}
                  </span>
                </div>
              )}
            </div>
          );
        })}

        {showTooltip && (
          <EventTooltip event={event} position={tooltipPosition} />
        )}
      </>
    );
  }

  // Стандартный рендер когда нет сегментов
  return (
    <>
      <div
        className="absolute rounded-none transition-all duration-300 cursor-pointer"
        style={eventStyles}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label={`${event.title}`}
      >
        {/* Текст события */}
        <div className="absolute inset-0 flex items-center">
          <span
            className={`truncate ${textColorConfig.className} font-medium ${fontConfig.fontSize} ${fontConfig.padding} ${fontConfig.lineHeight || ''}`}
            style={{
              paddingLeft: fontConfig.paddingLeft || '4px',
              transform: fontScale !== 1 ? `scale(${fontScale})` : undefined,
              transformOrigin: 'left center',
            }}
          >
            {event.title}
          </span>
        </div>
      </div>

      {showTooltip && <EventTooltip event={event} position={tooltipPosition} />}
    </>
  );
}
