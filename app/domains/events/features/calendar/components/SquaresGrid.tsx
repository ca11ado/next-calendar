"use client";
import React, { useEffect, useRef, useState } from "react";
import { Event } from "@/domains/events/types/Event";
import { getColorsByType } from "@/domains/events/utils/getColorByType";
import styles from "./SquaresGrid.module.css";
import { calculateSquareSize } from "@/domains/events/utils/calculateSquareSize";
import { isEventBelongsToPeriod } from "@/domains/events/utils/events";
import { getDateBySqueryId } from "@/domains/events/utils/getDateBySqueryId";

interface SquaresGridProps {
  count: number;
  startCalendarDate: Date;
  events: Event[];
  colorsByType: ReturnType<typeof getColorsByType>;
  width?: string;
  height?: string;
}

const SquaresGrid: React.FC<SquaresGridProps> = (props) => {
  const daysRatio = 7; // TODO:
  const {
    count,
    width = "400px",
    height = "600px",
    events,
    startCalendarDate,
    colorsByType,
  } = props;
  const [gridSize, setGridSize] = useState<number>(0);
  const gridRef = useRef<HTMLDivElement>(null);

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

  const getSquadColor = (id: number) => {
    const per = getDateBySqueryId(id, startCalendarDate, daysRatio);
    const event = events.find((e) =>
      isEventBelongsToPeriod(e, per.startDate, per.endDate)
    );

    if (!event) {
      return "";
    }

    return colorsByType[event.type];
  };

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
        <div
          key={index}
          className={styles.square}
          style={{ backgroundColor: getSquadColor(index + 1) }}
        ></div>
      ))}
    </div>
  );
};

export default SquaresGrid;
