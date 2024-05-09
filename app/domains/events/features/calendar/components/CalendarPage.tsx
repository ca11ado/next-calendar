import React, { ReactNode } from "react";
import Layout from "@/components/Layout";
import SquaresGrid from "@/domains/events/features/calendar/components/SquaresGrid";
import { Event } from "@/domains/events/types/Event";

interface CalendarPageProps {
  periods: number;
  events: Event[];
}

const CalendarPage: React.FC<CalendarPageProps> = ({ periods }) => {
  return (
    <Layout>
      <SquaresGrid count={periods} />
    </Layout>
  );
};

export default CalendarPage;
