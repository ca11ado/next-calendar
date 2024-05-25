"use client";
import React from "react";
import { LayoutTwoColumns } from "@/components/Layout";
import SquaresGrid from "@/domains/events/features/calendar/components/SquaresGrid";
import { Event } from "@/domains/events/types/Event";
import Events from "./Events";
import { getFirstEvent } from "@/domains/events/utils/events";
import { useEvents } from "./hooks/useEvents";
import ColorsAgenda from "./ColorsAgenda";

interface CalendarPageProps {
  periods: number;
  events: Event[];
}

const CalendarPage: React.FC<CalendarPageProps> = (props) => {
  const { periods, events: ssrEvents } = props;
  const { events, activeEvent, setActiveEvent } = useEvents(ssrEvents);
  const firstEvent = getFirstEvent(events);

  return (
    <LayoutTwoColumns>
      <div>
        <ColorsAgenda events={events} />
        <SquaresGrid
          width="600px"
          height="800px"
          count={periods}
          startCalendarDate={new Date(firstEvent.start_at)}
          events={events}
          activeEvent={activeEvent}
          setActiveEvent={setActiveEvent}
        />
      </div>
      <Events events={events} />
    </LayoutTwoColumns>
  );
};

export default CalendarPage;
