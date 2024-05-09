import React from "react";
import { Event } from "@/domains/events/types/Event";

const getDate = (date: string) => new Date(date).toLocaleDateString();

type Props = {
  events: Event[];
};

const Events: React.FC<Props> = (props) => {
  const { events } = props;
  return (
    <div>
      {events.map((event) => (
        <div>
          {getDate(event.start_at)} - {getDate(event.end_at)} --- {event.name}{" "}
          --- {event.type}
        </div>
      ))}
    </div>
  );
};

function getRandomColor() {
  const colors = ["#FFC0CB", "#FFD700", "#90EE90", "#87CEEB", "#BA55D3"];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

export default Events;
