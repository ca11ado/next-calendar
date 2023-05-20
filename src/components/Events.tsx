import React from 'react';
import { Event } from '@/types/Event';

interface EventProps {
  events: Event[];
}

const Events: React.FC<EventProps> = ({ events }) => {
  const usedColors: string[] = [];

  return (
    <>
      {events.map((event) => {
        let color = getRandomColor();
        while (usedColors.includes(color)) {
          color = getRandomColor();
        }
        usedColors.push(color);

        return (
          <div
            key={event.id}
            className="mb-4"
            style={{
              backgroundColor: color,
              height: '1rem',
            }}
          ></div>
        );
      })}
    </>
  );
};

function getRandomColor() {
  const colors = ['#FFC0CB', '#FFD700', '#90EE90', '#87CEEB', '#BA55D3'];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

export default Events;
