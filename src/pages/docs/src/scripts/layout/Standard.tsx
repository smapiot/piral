import * as React from 'react';
import { Footer } from './Footer';
import { Header } from './Header';
import { Breadcrumbs, Info, InfoProps, Breadcrumb, ColorKind } from '../components';

const buildTime = process.env.BUILD_TIME;
const version = process.env.BUILD_PCKG_VERSION;

export interface StandardProps extends InfoProps {
  breadcrumbs?: Array<Breadcrumb>;
  kind?: ColorKind;
}

export const Standard: React.SFC<StandardProps> = ({ children, title, icon, breadcrumbs, kind = 'green' }) => (
  <div className={`body-${kind}`}>
    <div className="page-wrapper">
      <Header>
        <Breadcrumbs current={title} intermediate={breadcrumbs} />
      </Header>
      <div className="doc-wrapper">
        <div className="container">
          <Info updated={buildTime} title={title} icon={icon} version={version} />
          <div className="doc-body row">{children}</div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);
