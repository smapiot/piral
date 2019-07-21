import * as React from 'react';
import { useStickySidebar } from '../hooks';

export const Sidebar: React.FC = ({ children }) => {
  const container = useStickySidebar();

  return (
    <div className="doc-sidebar col-md-3 col-12 order-0 d-none d-md-flex">
      <div className="doc-nav">
        <nav className="nav doc-menu flex-column sticky" ref={container}>
          {children}
        </nav>
      </div>
    </div>
  );
};
