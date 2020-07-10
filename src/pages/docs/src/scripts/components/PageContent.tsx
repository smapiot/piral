import * as React from 'react';
import { usePage } from './PageContext';

export interface PageContentProps {}

export const PageContent: React.FC<PageContentProps> = ({ children }) => {
  const container = React.useRef(undefined);
  const { setCurrent } = usePage();

  React.useEffect(() => setCurrent(container.current), []);

  return <div ref={container}>{children}</div>;
};
