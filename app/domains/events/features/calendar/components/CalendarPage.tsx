import React from "react";
import { LayoutTwoColumns } from "@/components/Layout";
import SquaresGrid from "@/domains/events/features/calendar/components/SquaresGrid";
import { Event } from "@/domains/events/types/Event";
import Events from "./Events";

interface CalendarPageProps {
  periods: number;
  events: Event[];
}

const CalendarPage: React.FC<CalendarPageProps> = (props) => {
  const { periods, events } = props;
  return (
    <LayoutTwoColumns>
      <SquaresGrid count={periods} />
      <Events events={events} />
    </LayoutTwoColumns>
  );
};

export default CalendarPage;
