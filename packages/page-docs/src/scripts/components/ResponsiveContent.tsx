import * as React from 'react';

export const ResponsiveContent: React.SFC = ({ children }) => (
  <div className="doc-content col-md-9 col-12 order-1">
    <div className="content-inner">{children}</div>
  </div>
);
