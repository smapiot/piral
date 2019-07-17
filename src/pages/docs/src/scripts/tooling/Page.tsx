import * as React from 'react';
import { Menu } from '../components';
import { Content } from './Content';
import { Standard } from '../layout';

export const Page: React.FC = () => {
  const ref = React.useRef(undefined);

  return (
    <Standard title="Tooling" icon="paper-plane" kind="blue">
      <Content ref={ref} />
      <Menu content={ref} maxLevel={1} />
    </Standard>
  );
};
