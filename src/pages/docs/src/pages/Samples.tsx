import * as React from 'react';

interface DemoProps {
  title: string;
  appLink: string;
  codeLink: string;
}

const Demo: React.FC<DemoProps> = ({ title, appLink, codeLink, children }) => (
  <div className="demo">
    <h2>{title}</h2>
    {children}
    <div className="buttons">
      <a href={appLink} target="_blank" className="btn primary">
        <i className="fas fa-link" />
        Open Application
      </a>
      <a href={codeLink} target="_blank" className="btn primary">
        <i className="fas fa-code-branch" />
        View Code
      </a>
    </div>
  </div>
);

const FullDemo: React.FC = () => (
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
    <img className="responsive-image" src={require('../assets/piral-full-demo.png')} alt="Piral Full Demo" />
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

const CoreDemo: React.FC = () => (
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
    <img className="responsive-image" src={require('../assets/piral-core-demo.png')} alt="Piral Core Demo" />
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

export default () => (
  <section className="container">
    <p>
      The following samples are available to see what Piral can bring to the table. The main focus of the samples is
      to teach the different concepts and introduce some common practices.
    </p>
    <p>
      The provided examples are not properly designed (as in styled). Styling can be fully customized for your needs
      anyway. The whole UX can be adjusted as desired. Nevertheless, the shown UX can be achieved with little to no
      effort.
    </p>
    <div className="demos">
      <CoreDemo />
      <FullDemo />
    </div>
  </section>
);
