import React, { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return <div className="container mx-auto py-8">{children}</div>;
};

export default Layout;

interface LayoutTwoColumnsProps {
  children: [ReactNode, ReactNode];
}

export const LayoutTwoColumns: React.FC<LayoutTwoColumnsProps> = ({
  children,
}) => {
  return (
    <div className="container mx-auto py-8 flex justify-between gap-4">
      {children[0]}
      {children[1]}
    </div>
  );
};
