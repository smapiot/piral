import * as React from 'react';
import { Footer } from './footer';
import { Header } from './header';
import { TagLine } from '../components';

export const Landing: React.SFC = ({ children }) => (
  <div className="landing-page body-green">
    <div className="page-wrapper">
      <Header centered>
        <TagLine />
      </Header>
      <div className="doc-wrapper">{children}</div>
    </div>
    <Footer />
  </div>
);
