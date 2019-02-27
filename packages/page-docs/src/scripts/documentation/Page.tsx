import * as React from 'react';
import { Menu } from './menu';
import { Content } from './Content';
import { Standard } from '../layout';

export const Page: React.SFC = () => (
  <Standard title="Quick Start">
    <Content />
    <Menu />
  </Standard>
);
