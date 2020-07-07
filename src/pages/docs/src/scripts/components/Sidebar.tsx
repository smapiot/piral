import * as React from 'react';
import { useStickySidebar } from '../hooks';

export interface SidebarProps {
  className: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ children, className }) => {
  const container = useStickySidebar();

  return (
    <div className={`${className} sticky`} ref={container}>
      <div className="scroller">{children}</div>
    </div>
  );
};
