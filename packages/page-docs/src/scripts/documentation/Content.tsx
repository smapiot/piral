import * as React from 'react';
import { Section, ResponsiveContent, Md, EditSection } from '../components';

export interface ContentProps {
  ref?: React.Ref<HTMLDivElement>;
}

export const Content: React.SFC<ContentProps> = React.forwardRef((_, ref) => (
  <ResponsiveContent ref={ref}>
    {/* start:auto-generated */}
    <Section id="download-section" title="Download">
      <Md>{require('../../../../../docs/introduction.md').default}</Md>
      <EditSection link="introduction.md" />
    </Section>
    <Section id="architecture-section" title="Architecture">
      <Md>{require('../../../../../docs/architecture.md').default}</Md>
      <EditSection link="architecture.md" />
    </Section>
    <Section id="development-section" title="Development">
      <Md>{require('../../../../../docs/development.md').default}</Md>
      <EditSection link="development.md" />
    </Section>
    {/* end:auto-generated */}
  </ResponsiveContent>
));
