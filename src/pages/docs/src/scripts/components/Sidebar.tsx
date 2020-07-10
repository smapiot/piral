import * as React from 'react';
import { useStickySidebar } from '../hooks';

export interface SidebarProps {
  className: string;
  children: React.ReactNode;
}

export const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(({ children, className }, scroller) => {
  const container = useStickySidebar();

  return (
    <div className={`${className} sticky`} ref={container}>
      <div className="scroller" ref={scroller}>
        {children}
      </div>
    </div>
  );
});
