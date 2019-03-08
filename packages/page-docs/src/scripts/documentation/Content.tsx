import * as React from 'react';
import { Section, ResponsiveContent, Md, EditSection } from '../components';
import Introduction from '../../../../../docs/introduction.md';
import Architecture from '../../../../../docs/architecture.md';
import Development from '../../../../../docs/development.md';

export interface ContentProps {
  ref?: React.Ref<HTMLDivElement>;
}

export const Content: React.SFC<ContentProps> = React.forwardRef((_, ref) => (
  <ResponsiveContent ref={ref}>
    <Section id="download-section" title="Download">
      <Md>{Introduction}</Md>
      <EditSection link="introduction.md" />
    </Section>
    <Section id="architecture-section" title="Architecture">
      <Md>{Architecture}</Md>
      <EditSection link="architecture.md" />
    </Section>
    <Section id="development-section" title="Development">
      <Md>{Development}</Md>
      <EditSection link="development.md" />
    </Section>
  </ResponsiveContent>
));
