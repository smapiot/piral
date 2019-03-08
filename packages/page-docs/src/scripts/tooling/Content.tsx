import * as React from 'react';
import { Section, ResponsiveContent, Md, EditSection } from '../components';
import BuildPilet from '../../../../../docs/commands/build-pilet.md';
import DebugPilet from '../../../../../docs/commands/debug-pilet.md';
import NewPilet from '../../../../../docs/commands/new-pilet.md';
import BuildPiral from '../../../../../docs/commands/build-piral.md';
import DebugPiral from '../../../../../docs/commands/debug-piral.md';

export interface ContentProps {
  ref?: React.Ref<HTMLDivElement>;
}

export const Content: React.SFC<ContentProps> = React.forwardRef((_, ref) => (
  <ResponsiveContent ref={ref}>
    <Section id="build-pilet" title="build-pilet">
      <Md>{BuildPilet}</Md>
      <EditSection link="commands/build-pilet.md" />
    </Section>
    <Section id="debug-pilet" title="debug-pilet">
      <Md>{DebugPilet}</Md>
      <EditSection link="commands/debug-pilet.md" />
    </Section>
    <Section id="new-pilet" title="new-pilet">
      <Md>{NewPilet}</Md>
      <EditSection link="commands/new-pilet.md" />
    </Section>
    <Section id="build-piral" title="build-piral">
      <Md>{BuildPiral}</Md>
      <EditSection link="commands/build-piral.md" />
    </Section>
    <Section id="debug-piral" title="debug-piral">
      <Md>{DebugPiral}</Md>
      <EditSection link="commands/debug-piral.md" />
    </Section>
  </ResponsiveContent>
));
