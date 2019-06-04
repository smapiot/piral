import * as React from 'react';
import { Section, ResponsiveContent, Ti } from '../components';

export interface ContentProps {
  ref?: React.Ref<HTMLDivElement>;
}

export const Content: React.SFC<ContentProps> = React.forwardRef((_, ref) => (
  <ResponsiveContent ref={ref}>
    {/* start:auto-generated */}
    <Section id="section-piral-cli" title="piral-cli">
      <Ti>{require('../../../../../../docs/types/piral-cli.json')}</Ti>
    </Section>
    <Section id="section-piral-core" title="piral-core">
      <Ti>{require('../../../../../../docs/types/piral-core.json')}</Ti>
    </Section>
    <Section id="section-piral-ext" title="piral-ext">
      <Ti>{require('../../../../../../docs/types/piral-ext.json')}</Ti>
    </Section>
    <Section id="section-piral" title="piral">
      <Ti>{require('../../../../../../docs/types/piral.json')}</Ti>
    </Section>
    {/* end:auto-generated */}
  </ResponsiveContent>
));
