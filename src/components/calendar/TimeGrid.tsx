import React, { useMemo } from 'react';

interface TimeGridProps {
  zoomScale: number;
}

/**
 * Компонент для отображения временной сетки (вертикальные линии для недель)
 */
export function TimeGrid({ zoomScale }: TimeGridProps) {
  // Вычисляем позиции линий для недель
  const gridLines = useMemo(() => {
    const lines: number[] = [];

    // Линия каждую неделю: 52 линии
    for (let week = 1; week <= 52; week++) {
      lines.push((week / 52) * 100);
    }

    return lines;
  }, []);

  // Стиль сетки
  const gridStyle = {
    borderColor: 'rgb(147, 197, 253)', // blue-300
    opacity: 0.3,
  };

  // При масштабе 50% убираем сетку
  const isCompact = zoomScale === 50;

  if (isCompact) {
    return null;
  }

  return (
    <>
      {gridLines.map((position, index) => (
        <div
          key={`grid-${index}`}
          className="absolute top-0 bottom-0 border-l"
          style={{
            left: `${position}%`,
            borderColor: gridStyle.borderColor,
            opacity: gridStyle.opacity,
          }}
        />
      ))}
    </>
  );
}
