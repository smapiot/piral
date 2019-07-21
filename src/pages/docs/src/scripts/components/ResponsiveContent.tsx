import * as React from 'react';

export interface ResponsiveContentProps {
  ref?: React.Ref<HTMLDivElement>;
}

export const ResponsiveContent: React.FC<ResponsiveContentProps> = React.forwardRef(({ children }, ref) => (
  <div className="doc-content col-md-9 col-12 order-1" ref={ref}>
    <div className="content-inner">{children}</div>
  </div>
));
