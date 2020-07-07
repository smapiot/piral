import * as React from 'react';
import { useLocation } from 'react-router';
import { TocMenu } from './TocMenu';
import { SectionMenu } from './SectionMenu';
import { resolveSections } from '../sitemap';

export const ContentPage: React.FC = ({ children }) => {
  const ref = React.useRef(undefined);
  const { hash, pathname } = useLocation();

  React.useEffect(() => {
    const tid = setTimeout(() => {
      const element = document.getElementById(hash.substr(1));
      element?.scrollIntoView({ behavior: 'smooth', inline: 'nearest' });
    }, 10);
    return () => clearTimeout(tid);
  }, [hash]);

  return (
    <>
      <SectionMenu active={pathname} sections={resolveSections(pathname)} />
      <TocMenu content={ref} />
      <div className="content-display" ref={ref}>
        {children}
      </div>
    </>
  );
};
