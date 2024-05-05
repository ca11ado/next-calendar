import React, { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
}

const Card: React.FC<CardProps> = ({ children }) => {
  return (
    <div className="flex-1 min-w-[20px] h-[20px] bg-blue-500 m-1">
      {children}
    </div>
  );
};

export default Card;
