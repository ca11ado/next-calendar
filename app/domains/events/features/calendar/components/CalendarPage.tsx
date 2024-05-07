import React, { ReactNode } from "react";
import Layout from "@/components/Layout";
import SquaresGrid from "@/domains/events/features/calendar/components/SquaresGrid";

interface CalendarPageProps {
  periods: number;
}

const CalendarPage: React.FC<CalendarPageProps> = ({ periods }) => {
  return (
    <Layout>
      <SquaresGrid count={periods} />
    </Layout>
  );
};

export default CalendarPage;
