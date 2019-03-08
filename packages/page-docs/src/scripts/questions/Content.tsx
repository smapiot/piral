import * as React from 'react';
import { ResponsiveContent, Section, Md, Question, EditSection } from '../components';

import General from '../../../../../docs/questions/general.md';
import Tooling from '../../../../../docs/questions/tooling.md';

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
    <Section id="general" title="General">
      <Mdq>{General}</Mdq>
      <EditSection link="questions/general.md" />
    </Section>
    <Section id="tooling" title="Tooling">
      <Mdq>{Tooling}</Mdq>
      <EditSection link="questions/tooling.md" />
    </Section>
  </ResponsiveContent>
));
