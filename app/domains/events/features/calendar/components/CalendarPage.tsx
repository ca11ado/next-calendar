import React, { ReactNode } from "react";
import Layout from "@/components/Layout";

interface CalendarPageProps {
  children: ReactNode[];
}

const CalendarPage: React.FC<CalendarPageProps> = ({ children }) => {
  return (
    <Layout>
      <div className="h-screen w-screen p-4 flex flex-wrap overflow-hidden bg-gray-200">
        {children}
      </div>
    </Layout>
  );
};

export default CalendarPage;
