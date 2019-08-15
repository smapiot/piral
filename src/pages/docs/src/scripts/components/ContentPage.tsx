import * as React from 'react';
import { Menu } from './Menu';

export const ContentPage: React.FC = ({ children }) => {
  const ref = React.useRef(undefined);

  return (
    <div className="doc-container">
      <Menu content={ref} />
      <div className="doc-content" ref={ref}>
        {children}
      </div>
    </div>
  );
};
