"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./SquaresGrid.module.css";
import { calculateSquareSize } from "@/domains/events/utils/calculateSquareSize";

interface SquaresGridProps {
  count: number;
  width?: string;
  height?: string;
}

const SquaresGrid: React.FC<SquaresGridProps> = ({
  count,
  width = "400px",
  height = "600px",
}) => {
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
        <div key={index} className={styles.square}></div>
      ))}
    </div>
  );
};

export default SquaresGrid;
