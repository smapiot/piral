import * as React from 'react';
import { ResponsiveContent, Section, Md, Question, EditSection } from '../components';

// tslint:disable-next-line
const defaultResult = null;

function createQuestionScope() {
  return {
    h2({ children }) {
      return <Question title={children} />;
    },
    hr() {
      return defaultResult;
    },
  };
}

const Mdq: React.SFC<{ children: string }> = ({ children }) => <Md overrides={createQuestionScope()}>{children}</Md>;

export interface ContentProps {
  ref?: React.Ref<HTMLDivElement>;
}

export const Content: React.SFC<ContentProps> = React.forwardRef((_, ref) => (
  <ResponsiveContent ref={ref}>
    {/* start:auto-generated */}
    <Section id="section-general" title="General">
      <Mdq>{require('../../../../../../docs/questions/general.md')}</Mdq>
      <EditSection link="questions/general.md" />
    </Section>
    <Section id="section-extensions" title="Extensions">
      <Mdq>{require('../../../../../../docs/questions/extensions.md')}</Mdq>
      <EditSection link="questions/extensions.md" />
    </Section>
    <Section id="section-tooling" title="Tooling">
      <Mdq>{require('../../../../../../docs/questions/tooling.md')}</Mdq>
      <EditSection link="questions/tooling.md" />
    </Section>
    {/* end:auto-generated */}
  </ResponsiveContent>
));
