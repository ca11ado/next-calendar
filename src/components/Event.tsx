import React, { ReactNode } from 'react';

interface EventProps {
  children: ReactNode;
  color: string;
}

const Event: React.FC<EventProps> = ({ children, color }) => {
  return (
    <div
      className="mb-4 text-xs truncate"
      style={{
        backgroundColor: color,
        height: '1rem',
      }}
    ><span className='inline-block max-w-full overflow-hidden'>{children}</span></div>
  );
};

export default Event;
