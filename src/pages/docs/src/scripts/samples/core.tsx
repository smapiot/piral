import * as React from 'react';
import { Demo } from '../components';

export const CoreDemo: React.SFC = () => (
  <Demo
    title="Piral Core Application"
    appLink="https://demo-core.piral.io"
    codeLink="https://github.com/smapiot/piral/tree/master/src/samples/sample-piral-core">
    <p>
      An example app based on <code>piral-core</code>.
    </p>
    <blockquote>
      <p>Pilets are integrated for simplicity. The core pilet API is demonstrated.</p>
    </blockquote>
  </Demo>
);
