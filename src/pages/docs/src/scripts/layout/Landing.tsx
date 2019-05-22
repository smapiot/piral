import * as React from 'react';
import { Footer } from './Footer';
import { Header } from './Header';
import { TagLine } from '../components';

const version = process.env.BUILD_PCKG_VERSION;

export const Landing: React.SFC = ({ children }) => (
  <div className="landing-page body-green">
    <div className="page-wrapper">
      <Header centered>
        <TagLine version={version} />
      </Header>
      <div className="doc-wrapper">{children}</div>
    </div>
    <Footer />
  </div>
);
