import * as React from 'react';
import { Section, ResponsiveContent, Md, EditSection } from '../components';

export interface ContentProps {
  ref?: React.Ref<HTMLDivElement>;
}

export const Content: React.SFC<ContentProps> = React.forwardRef((_, ref) => (
  <ResponsiveContent ref={ref}>
    {/* start:auto-generated */}
    <Section id="section-build-piral" title="build-piral">
      <Md>{require('../../../../../../docs/commands/build-piral.md')}</Md>
      <EditSection link="commands/build-piral.md" />
    </Section>
    <Section id="section-debug-piral" title="debug-piral">
      <Md>{require('../../../../../../docs/commands/debug-piral.md')}</Md>
      <EditSection link="commands/debug-piral.md" />
    </Section>
    <Section id="section-install-piral" title="install-piral">
      <Md>{require('../../../../../../docs/commands/install-piral.md')}</Md>
      <EditSection link="commands/install-piral.md" />
    </Section>
    <Section id="section-new-pilet" title="new-pilet">
      <Md>{require('../../../../../../docs/commands/new-pilet.md')}</Md>
      <EditSection link="commands/new-pilet.md" />
    </Section>
    <Section id="section-upgrade-pilet" title="upgrade-pilet">
      <Md>{require('../../../../../../docs/commands/upgrade-pilet.md')}</Md>
      <EditSection link="commands/upgrade-pilet.md" />
    </Section>
    <Section id="section-build-pilet" title="build-pilet">
      <Md>{require('../../../../../../docs/commands/build-pilet.md')}</Md>
      <EditSection link="commands/build-pilet.md" />
    </Section>
    <Section id="section-debug-pilet" title="debug-pilet">
      <Md>{require('../../../../../../docs/commands/debug-pilet.md')}</Md>
      <EditSection link="commands/debug-pilet.md" />
    </Section>
    <Section id="section-pack-pilet" title="pack-pilet">
      <Md>{require('../../../../../../docs/commands/pack-pilet.md')}</Md>
      <EditSection link="commands/pack-pilet.md" />
    </Section>
    <Section id="section-publish-pilet" title="publish-pilet">
      <Md>{require('../../../../../../docs/commands/publish-pilet.md')}</Md>
      <EditSection link="commands/publish-pilet.md" />
    </Section>
    {/* end:auto-generated */}
  </ResponsiveContent>
));
