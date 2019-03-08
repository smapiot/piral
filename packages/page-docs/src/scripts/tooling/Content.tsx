import * as React from 'react';
import { Section, ResponsiveContent, Md, EditSection } from '../components';

export interface ContentProps {
  ref?: React.Ref<HTMLDivElement>;
}

export const Content: React.SFC<ContentProps> = React.forwardRef((_, ref) => (
  <ResponsiveContent ref={ref}>
    {/* start:auto-generated */}
    <Section id="build-pilet" title="build-pilet">
      <Md>{require('../../../../../docs/commands/build-pilet.md').default}</Md>
      <EditSection link="commands/build-pilet.md" />
    </Section>
    <Section id="debug-pilet" title="debug-pilet">
      <Md>{require('../../../../../docs/commands/debug-pilet.md').default}</Md>
      <EditSection link="commands/debug-pilet.md" />
    </Section>
    <Section id="new-pilet" title="new-pilet">
      <Md>{require('../../../../../docs/commands/new-pilet.md').default}</Md>
      <EditSection link="commands/new-pilet.md" />
    </Section>
    <Section id="build-piral" title="build-piral">
      <Md>{require('../../../../../docs/commands/build-piral.md').default}</Md>
      <EditSection link="commands/build-piral.md" />
    </Section>
    <Section id="debug-piral" title="debug-piral">
      <Md>{require('../../../../../docs/commands/debug-piral.md').default}</Md>
      <EditSection link="commands/debug-piral.md" />
    </Section>
    {/* end:auto-generated */}
  </ResponsiveContent>
));
