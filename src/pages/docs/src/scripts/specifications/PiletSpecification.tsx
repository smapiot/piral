import * as React from 'react';
import { Section, ResponsiveContent, Md, EditSection, Menu } from '../components';

const Content: React.FC = () => {
  const ref = React.useRef(undefined);

  return (
    <>
      <ResponsiveContent ref={ref}>
        <Section id="pilet-specification" title="Pilet Specification">
          <Md>{require('../../../../../../docs/specs/pilet-specification.md')}</Md>
          <EditSection link="specs/pilet-specification.md" />
        </Section>
      </ResponsiveContent>
      <Menu content={ref} />
    </>
  );
};

export default Content;
