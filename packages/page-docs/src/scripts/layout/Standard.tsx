import * as React from 'react';
import { Footer } from './Footer';
import { Header } from './Header';
import { Breadcrumbs, Info, InfoProps, Breadcrumb } from '../components';

const buildTime = process.env.BUILD_TIME;

export interface StandardProps extends InfoProps {
  breadcrumbs?: Array<Breadcrumb>;
}

export const Standard: React.SFC<StandardProps> = ({ children, title, icon, breadcrumbs }) => (
  <div className="body-green">
    <div className="page-wrapper">
      <Header>
        <Breadcrumbs current={title} intermediate={breadcrumbs} />
      </Header>
      <div className="doc-wrapper">
        <div className="container">
          <Info updated={buildTime} title={title} icon={icon} />
          <div className="doc-body row">{children}</div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);
