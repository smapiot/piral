import * as React from 'react';
import { useLocation } from 'react-router';
import { Page } from './PageContext';
import { TocMenu } from './TocMenu';
import { SectionMenu } from './SectionMenu';
import { resolveSections } from '../sitemap';

export const ContentPage: React.FC = ({ children }) => {
  const { pathname } = useLocation();
  const sections = React.useMemo(() => resolveSections(pathname), [pathname]);

  return (
    <Page>
      <SectionMenu sections={sections} />
      <TocMenu />
      <div className="content-display">{children}</div>
    </Page>
  );
};
