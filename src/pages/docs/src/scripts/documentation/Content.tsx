import * as React from 'react';
import { Section, ResponsiveContent, Md, EditSection, Callout } from '../components';

export interface ContentProps {}

export const Content = React.forwardRef<HTMLDivElement, ContentProps>((_, ref) => (
  <ResponsiveContent ref={ref}>
    {/* start:auto-generated */}
    <Section id="section-introduction" title="Introduction">
      <Md>{require('../../../../../../docs/introduction.md')}</Md>
      <EditSection link="introduction.md" />
    </Section>
    <Section id="section-features-and-alternatives" title="Features and Alternatives">
      <Md>{require('../../../../../../docs/features.md')}</Md>
      <EditSection link="features.md" />
    </Section>
    <Section id="section-architecture" title="Architecture">
      <Md>{require('../../../../../../docs/architecture.md')}</Md>
      <EditSection link="architecture.md" />
    </Section>
    <Section id="section-package-metadata" title="Package Metadata">
      <Md>{require('../../../../../../docs/metadata.md')}</Md>
      <EditSection link="metadata.md" />
    </Section>
    <Section id="section-browser-compatibility" title="Browser Compatibility">
      <Md>{require('../../../../../../docs/browsers.md')}</Md>
      <EditSection link="browsers.md" />
    </Section>
    <Section id="section-project-history" title="Project History">
      <Md>{require('../../../../../../docs/history.md')}</Md>
      <EditSection link="history.md" />
    </Section>
    {/* end:auto-generated */}
  </ResponsiveContent>
));
