import * as React from 'react';
import { Footer } from './footer';
import { Header } from './header';
import { Breadcrumbs, Info, InfoProps } from '../components';

export const Standard: React.SFC<InfoProps> = ({ children, title, icon }) => (
  <div className="body-green">
    <div className="page-wrapper">
      <Header>
        <Breadcrumbs current={title} />
      </Header>
      <div className="doc-wrapper">
        <div className="container">
          <Info updated="July 18th, 2018" title={title} icon={icon} />
          <div className="doc-body row">{children}</div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);
