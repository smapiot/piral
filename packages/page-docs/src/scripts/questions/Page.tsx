import * as React from 'react';
import { Menu } from './menu';
import { Content } from './Content';
import { Standard } from '../layout';

export const Page: React.SFC = () => (
  <Standard title="FAQs" icon={<span aria-hidden="true" className="icon icon_lifesaver" />}>
    <Content />
    <Menu />
  </Standard>
);
