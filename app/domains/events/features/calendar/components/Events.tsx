import React from "react";
import { Event } from "@/domains/events/types/Event";

const getDate = (date: string) => new Date(date).toLocaleDateString();

type Props = {
  events: Event[];
};

const Events: React.FC<Props> = (props) => {
  const { events } = props;
  return (
    <div className="bg-white shadow-md rounded-lg p-4 max-w-sm">
      <ul className="list-none space-y-2">
        {events.map((event) => (
          <li className="border-b border-gray-200 pb-2 mb-2">
            {getDate(event.start_at)} - {getDate(event.end_at)} -- {event.name}{" "}
            {event.type}
          </li>
        ))}
      </ul>
    </div>
  );
};

function getRandomColor() {
  const colors = ["#FFC0CB", "#FFD700", "#90EE90", "#87CEEB", "#BA55D3"];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

export default Events;
