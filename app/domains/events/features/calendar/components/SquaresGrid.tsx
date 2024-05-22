"use client";
import React, { useEffect, useRef, useState } from "react";
import { Event } from "@/domains/events/types/Event";
import { getColorsByType } from "@/domains/events/utils/getColorByType";
import styles from "./SquaresGrid.module.css";
import { calculateSquareSize } from "@/domains/events/utils/calculateSquareSize";
import Square from "./Square";

interface SquaresGridProps {
  count: number;
  startCalendarDate: Date;
  events: Event[];
  colorsByType: ReturnType<typeof getColorsByType>;
  width: string;
  height: string;
}

const SquaresGrid: React.FC<SquaresGridProps> = (props) => {
  const { count, width, height, events, startCalendarDate, colorsByType } =
    props;
  const [activeType, setActiveType] = useState<string | null>(null);
  const [gridSize, setGridSize] = useState<number>(0);
  const gridRef = useRef<HTMLDivElement>(null);

  const onSquadeClick = (event: Event) => {
    setActiveType(event.type);
  };

  useEffect(() => {
    const updateGridSize = () => {
      if (gridRef.current) {
        const width = gridRef.current.offsetWidth;
        const height = gridRef.current.offsetHeight;
        const size = calculateSquareSize(width, height, 1, count);
        setGridSize(size);
      }
    };

    updateGridSize();
    window.addEventListener("resize", updateGridSize);

    return () => window.removeEventListener("resize", updateGridSize);
  }, [count]);

  return (
    <div
      ref={gridRef}
      className={styles.squaresGrid}
      style={{
        width,
        height,
        gridTemplateColumns: `repeat(auto-fill, minmax(${gridSize}px, 1fr))`,
        gridAutoRows: `${gridSize}px`,
      }}
    >
      {Array.from({ length: count }, (_, index) => (
        <Square
          key={index}
          index={index}
          startCalendarDate={startCalendarDate}
          events={events}
          colorsByType={colorsByType}
          activeType={activeType}
          onClick={onSquadeClick}
        />
      ))}
    </div>
  );
};

export default SquaresGrid;
