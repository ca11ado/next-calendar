import React, { ReactNode } from "react";
import Layout from "@/app/components/Layout";
import Card from "./Card";

interface CalendarPageProps {
  children: ReactNode[];
}

const CalendarPage: React.FC<CalendarPageProps> = ({ children }) => {
  return (
    <Layout>
      <div className="grid grid-cols-3 gap-4 md:grid-cols-5 lg:grid-cols-6">
        {children.map((child, index) => (
          <Card key={index}>{child}</Card>
        ))}
      </div>
    </Layout>
  );
};

export default CalendarPage;
