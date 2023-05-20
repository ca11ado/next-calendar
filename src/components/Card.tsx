import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
}

const Card: React.FC<CardProps> = ({ children }) => {
  return (
    <div className="p-4">
      <div className="bg-white rounded shadow">
        {children}
      </div>
    </div>
  );
};

export default Card;
