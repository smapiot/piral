import * as React from 'react';
import * as Stickyfill from 'stickyfilljs';
import { useRef, useEffect } from 'react';
import ScrollSpy from 'vanillajs-scrollspy';

export const Sidebar: React.SFC = ({ children }) => {
  const container = useRef(undefined);
  useEffect(() => {
    const spy = new ScrollSpy(container.current);
    Stickyfill.add(container.current);
    spy.init();
  });

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
