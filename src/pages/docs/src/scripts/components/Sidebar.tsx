import * as React from 'react';
import { useStickySidebar } from '../hooks';

export const Sidebar: React.FC = ({ children }) => {
  const container = useStickySidebar();

  return (
    <div className="doc-sidebar sticky" ref={container}>
      <nav className="doc-menu">{children}</nav>
    </div>
  );
};
