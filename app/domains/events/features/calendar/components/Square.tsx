"use client";
import React from "react";
import { Event } from "@/domains/events/types/Event";
import { getColorByType } from "@/domains/events/utils/getColorByType";
import styles from "./Square.module.css";
import { isEventBelongsToPeriod } from "@/domains/events/utils/events";
import { getDateBySqueryId } from "@/domains/events/utils/getDateBySqueryId";

const getCurrentEvent = (
  id: number,
  events: Event[],
  startCalendarDate: Date,
  daysRatio: number
) => {
  const per = getDateBySqueryId(id, startCalendarDate, daysRatio);
  const event = events.find((e) =>
    isEventBelongsToPeriod(e, per.startDate, per.endDate)
  );

  return event || null;
};

interface Square {
  index: number;
  startCalendarDate: Date;
  events: Event[];
  activeEvent: Event | null;
  onClick: (event: Event | null) => void;
}

const Square: React.FC<Square> = (props) => {
  const daysRatio = 7; // TODO:
  const { index, events, startCalendarDate, activeEvent, onClick } = props;

  const defaultBackgroundColor = "#fff";

  const event = getCurrentEvent(
    index + 1,
    events,
    startCalendarDate,
    daysRatio
  );

  const color = event ? getColorByType(event.type) : "";
  const onEventClick = event ? () => onClick(event) : () => onClick(null);
  const style = { backgroundColor: color || defaultBackgroundColor };

  return (
    <div
      onClick={onEventClick}
      key={index}
      className={
        (styles.square,
        activeEvent?.type && activeEvent?.type === event?.type
          ? styles.squareActive
          : "")
      }
      style={style}
    ></div>
  );
};

export default Square;
