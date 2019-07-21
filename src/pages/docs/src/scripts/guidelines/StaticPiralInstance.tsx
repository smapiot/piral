import * as React from 'react';
import { Section, ResponsiveContent, Md, EditSection, Menu } from '../components';

const Content: React.FC = () => {
  const ref = React.useRef(undefined);

  return (
    <>
      <ResponsiveContent ref={ref}>
        <Section id="static-piral-instance" title="Static Piral Instance">
          <Md>{require('../../../../../../docs/guidelines/static-piral-instance.md')}</Md>
          <EditSection link="guidelines/static-piral-instance.md" />
        </Section>
      </ResponsiveContent>
      <Menu content={ref} />
    </>
  );
};

export default Content;
