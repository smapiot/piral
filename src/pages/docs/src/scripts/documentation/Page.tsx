import * as React from 'react';
import { Menu } from '../components';
import { Content } from './Content';
import { Standard } from '../layout';

export const Page: React.FC = () => {
  const ref = React.useRef(undefined);

  return (
    <Standard title="Documentation" icon="book" kind="blue">
      <Content ref={ref} />
      <Menu content={ref} />
    </Standard>
  );
};
