import * as React from 'react';
import { Demo } from '../components';

export const FullDemo: React.FC = () => (
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
    <p>
      The sample shows how a full Piral instance can be created using a completely custom UI and only standard
      functional components. The idea behind this example is to illustrate how little needs to be done to create a
      microfrontend shell. A virtual pilet is brought in via the attach API.
    </p>
    <img className="responsive" src={require('../../assets/piral-full-demo.png')} alt="Piral Full Demo" />
    <p>
      No backend interactions are mocked. However, there is no sample gateway. Instead, pilets are going directly
      through different backend services such as the OpenWeather API. Pilets are retrieved from the sample feed.
    </p>
    <p>
      The sample pilets are all available in our sample pilets repository on GitHub. Each sample is also published on
      NPM to easily allow playing around with them.
    </p>
  </Demo>
);
