import React from "react";
import { Event } from "@/domains/events/types/Event";
import { getColorByType } from "@/domains/events/utils/getColorByType";

const getDate = (date: string) => new Date(date).toLocaleDateString();

type Props = {
  events: Event[];
};

const Events: React.FC<Props> = (props) => {
  const { events } = props;
  const colorsByType = getColorByType(events);
  return (
    <div className="bg-white shadow-md rounded-lg p-4 max-w-sm">
      <ul className="list-none space-y-2">
        {events.map((event) => (
          <li
            className="border-b border-gray-200 pb-2 mb-2"
            style={{ backgroundColor: colorsByType[event.type] }}
          >
            {getDate(event.start_at)} - {getDate(event.end_at)} -- {event.name}{" "}
            {event.type}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Events;
