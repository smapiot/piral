import * as React from 'react';
import { Section, ResponsiveContent, Md, EditSection, Menu } from '../components';

const Content: React.FC = () => {
  const ref = React.useRef(undefined);

  return (
    <>
      <ResponsiveContent ref={ref}>
        <Section id="server-side-rendering" title="Server Side Rendering">
          <Md>{require('../../../../../../docs/guidelines/server-side-rendering.md')}</Md>
          <EditSection link="guidelines/server-side-rendering.md" />
        </Section>
      </ResponsiveContent>
      <Menu content={ref} />
    </>
  );
};

export default Content;
