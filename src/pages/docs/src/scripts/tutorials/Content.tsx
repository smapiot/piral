import * as React from 'react';
import { Section, ResponsiveContent, Md, EditSection, Callout } from '../components';

export interface ContentProps {}

export const Content = React.forwardRef<HTMLDivElement, ContentProps>((_, ref) => (
  <ResponsiveContent ref={ref}>

    <Section id="section-Introduction" title="Introduction">
      <Md>{require('../../../../../../docs/tutorials/01-introduction.md')}</Md>
      <EditSection link="tutorials/getting-started.md" />
    </Section>
    <Section id="section-getting-started" title="Getting Started">
      <Md>{require('../../../../../../docs/tutorials/02-getting-started.md')}</Md>
      <EditSection link="tutorials/getting-started.md" />
    </Section>

  </ResponsiveContent>
));
