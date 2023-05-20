'use client'

import React, { ReactNode, useState } from 'react';

interface EventProps {
  children: ReactNode;
  color: string;
}

const Event: React.FC<EventProps> = ({ children, color }) => {
  const [isTooltipVisible, setTooltipVisible] = useState(false);

  const handleMouseEnter = () => {
    setTooltipVisible(true);
  };

  const handleMouseLeave = () => {
    setTooltipVisible(false);
  };

  return (
    <div
      className="mb-4 text-xs truncate"
      style={{
        backgroundColor: color,
        height: '1rem',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className="inline-block max-w-full overflow-hidden">
        {children}
      </span>
      {isTooltipVisible && (
        <div className="absolute z-10 p-2 bg-black text-white text-sm whitespace-nowrap">
          {children}
        </div>
      )}
    </div>
  );
};

export default Event;
