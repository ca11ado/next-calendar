import React, { ReactNode } from "react";

interface ListProps {
  children: ReactNode;
  events: any;
}

const List: React.FC<ListProps> = ({ children }) => {
  return <div className="p-4">{children}</div>;
};

export default List;
