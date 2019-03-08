import * as React from 'react';
import { Section, ResponsiveContent, Md, EditSection, Menu } from '../components';
import Pilet from '../../../../../docs/specs/pilet-specification.md';

const Content: React.SFC = () => {
  const ref = React.useRef(undefined);

  return (
    <>
      <ResponsiveContent ref={ref}>
        <Section id="specification" title="Pilet">
          <Md>{Pilet}</Md>
          <EditSection link="specs/pilet-specification.md" />
        </Section>
      </ResponsiveContent>
      <Menu content={ref} />
    </>
  );
};

export default Content;
