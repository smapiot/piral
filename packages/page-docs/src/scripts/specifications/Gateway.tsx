import * as React from 'react';
import { Section, ResponsiveContent, Md, EditSection, Menu } from '../components';

const Content: React.SFC = () => {
  const ref = React.useRef(undefined);

  return (
    <>
      <ResponsiveContent ref={ref}>
        <Section id="specification" title="Gateway">
          <Md>{require('../../../../../docs/specs/gateway-specification.md')}</Md>
          <EditSection link="specs/gateway-specification.md" />
        </Section>
      </ResponsiveContent>
      <Menu content={ref} />
    </>
  );
};

export default Content;
