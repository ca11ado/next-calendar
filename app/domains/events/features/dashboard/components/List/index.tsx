import React, { ReactNode } from "react";

interface ListProps {
  children: ReactNode;
}

const List: React.FC<ListProps> = ({ children }) => {
  return <div className="p-4">{children}</div>;
};

export default List;
