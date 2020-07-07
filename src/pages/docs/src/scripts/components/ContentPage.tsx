import * as React from 'react';
import { TocMenu } from './TocMenu';
import { SectionMenu } from './SectionMenu';
import { useLocation } from 'react-router';

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
      <SectionMenu
        active={pathname}
        sections={[
          {
            title: 'Getting Started',
            links: [
              {
                href: '/tutorials/01-introduction',
                name: 'Introduction',
              },
              {
                href: '/tutorials/02-getting-started',
                name: 'Getting Started',
              },
            ],
          },
          {
            title: 'Examples',
            links: [
              {
                href: '/tutorials/03-introduction',
                name: 'Cross-Framework Sample',
              },
            ],
          },
        ]}
      />
      <TocMenu content={ref} />
      <div className="content-display" ref={ref}>
        {children}
      </div>
    </>
  );
};
