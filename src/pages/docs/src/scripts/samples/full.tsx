import * as React from 'react';
import { Demo } from '../components';

export const FullDemo: React.SFC = () => (
  <Demo
    title="Piral Application"
    appLink="https://demo-full.piral.io"
    codeLink="https://github.com/smapiot/piral/tree/master/src/samples/sample-piral">
    <p>
      An example app based on <code>piral</code>.
    </p>
    <blockquote>
      <p>Pilets are fetched dynamically. Data loading and pilet communication is demonstrated.</p>
    </blockquote>
  </Demo>
);
