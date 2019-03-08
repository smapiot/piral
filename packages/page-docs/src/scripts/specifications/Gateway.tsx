import * as React from 'react';
import { Section, ResponsiveContent, Md, EditSection, Menu } from '../components';
import Gateway from '../../../../../docs/specs/gateway-specification.md';

const Content: React.SFC = () => {
  const ref = React.useRef(undefined);

  return (
    <>
      <ResponsiveContent ref={ref}>
        <Section id="specification" title="Gateway">
          <Md>{Gateway}</Md>
          <EditSection link="specs/gateway-specification.md" />
        </Section>
      </ResponsiveContent>
      <Menu content={ref} />
    </>
  );
};

export default Content;
