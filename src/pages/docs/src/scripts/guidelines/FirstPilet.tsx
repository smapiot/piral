import * as React from 'react';
import { Section, ResponsiveContent, Md, EditSection, Menu } from '../components';

const Content: React.FC = () => {
  const ref = React.useRef(undefined);

  return (
    <>
      <ResponsiveContent ref={ref}>
        <Section id="first-pilet" title="First Pilet">
          <Md>{require('../../../../../../docs/guidelines/first-pilet.md')}</Md>
          <EditSection link="guidelines/first-pilet.md" />
        </Section>
      </ResponsiveContent>
      <Menu content={ref} />
    </>
  );
};

export default Content;
