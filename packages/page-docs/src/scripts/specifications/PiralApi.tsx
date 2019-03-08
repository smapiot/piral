import * as React from 'react';
import { Section, ResponsiveContent, Md, EditSection, Menu } from '../components';
import PiralApi from '../../../../../docs/specs/piral-api-specification.md';

const Content: React.SFC = () => {
  const ref = React.useRef(undefined);

  return (
    <>
      <ResponsiveContent ref={ref}>
        <Section id="specification" title="Piral API">
          <Md>{PiralApi}</Md>
          <EditSection link="specs/piral-api-specification.md" />
        </Section>
      </ResponsiveContent>
      <Menu content={ref} />
    </>
  );
};

export default Content;
