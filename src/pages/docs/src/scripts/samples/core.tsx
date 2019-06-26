import * as React from 'react';
import { Demo } from '../components';

export const CoreDemo: React.FC = () => (
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
    <p>
      The sample shows the essential use of piral-core with a very simple layout and a variety of (integrated) pilets
      that use most of the core pilet API functions. Additionally, some of the available (opt-in) extension packages are
      shown, such as piral-ng (Angular API) and piral-vue (Vue API).
    </p>
    <img className="responsive" src={require('../../assets/piral-core-demo.png')} alt="Piral Core Demo" />
    <p>
      All backend interactions are mocked (e.g., via a setTimeout) to indicate only what Piral can do to sustain a good
      UX, for example by providing loading spinners.
    </p>
    <p>
      The shown connectors display how simple an interactive data feed can be connected. Furthermore, the form examples
      illustrate the ease of making robust form handling with Piral.
    </p>
  </Demo>
);
