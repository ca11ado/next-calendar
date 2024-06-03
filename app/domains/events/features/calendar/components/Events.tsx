import React from "react";
import { Event } from "@/domains/events/types/Event";
import { getColorByType } from "@/domains/events/utils/getColorByType";
import { isCurrentEvent } from "@/domains/events/utils/events";

type Props = {
  events: Event[];
  activeEvent: Event | null;
  setActiveEvent: (event: Event) => void;
};

const Events: React.FC<Props> = (props) => {
  const { events, activeEvent, setActiveEvent } = props;
  const style = (event: Event) => ({
    backgroundColor: getColorByType(event.type),
    BoxSizing: "border-box",
    ...(isCurrentEvent(event, activeEvent) && { border: "2px solid black" }),
  });
  return (
    <div className="bg-white shadow-md rounded-lg p-1 max-w-sm">
      <ul className="list-none space-y-1">
        {events.map((event) => (
          <li
            key={`${event.start_at}-${event.name}`}
            className="border-b border-gray-200 p-1 mb-2"
            style={style(event)}
            onClick={() => setActiveEvent(event)}
          >
            {event.name} {event.type}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Events;
