"use client";
import React from "react";
import { Event } from "@/domains/events/types/Event";
import { getColorsByType } from "@/domains/events/utils/getColorByType";
import styles from "./SquaresGrid.module.css";
import { isEventBelongsToPeriod } from "@/domains/events/utils/events";
import { getDateBySqueryId } from "@/domains/events/utils/getDateBySqueryId";

interface Square {
  index: number;
  startCalendarDate: Date;
  events: Event[];
  colorsByType: ReturnType<typeof getColorsByType>;
}

const Square: React.FC<Square> = (props) => {
  const daysRatio = 7; // TODO:
  const { index, events, startCalendarDate, colorsByType } = props;

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
      key={index}
      className={styles.square}
      style={{ backgroundColor: getSquadColor(index + 1) }}
    ></div>
  );
};

export default Square;
