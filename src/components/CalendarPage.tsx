import React, { ReactNode } from 'react';
import Card from './Card';

interface CalendarPageProps {
  children: ReactNode[];
}

const CalendarPage: React.FC<CalendarPageProps> = ({ children }) => {
  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-3 gap-4 md:grid-cols-5 lg:grid-cols-6">
        {children.map((child, index) => (
          <Card key={index}>
            {child}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CalendarPage;
