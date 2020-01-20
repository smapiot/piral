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
    <img className="responsive-image" src={require('../assets/demo-full.png')} alt="Piral Full Demo" />
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
      that use most of the core pilet API functions. Some parts of the layout are fully customized by taking advantage
      of the available state container.
    </p>
    <img className="responsive-image" src={require('../assets/demo-core.png')} alt="Piral Core Demo" />
    <p>
      All backend interactions are mocked (e.g., via a <code>setTimeout</code>) to indicate only what Piral can do to
      sustain a good UX, for example by providing loading spinners.
    </p>
    <p>
      The shown connectors display how simple an interactive data feed can be connected. Furthermore, the form examples
      illustrate the ease of making robust form handling with Piral.
    </p>
  </Demo>
);

const CrossDemo: React.FC = () => (
  <Demo
    title="Cross Framework Application"
    appLink="https://demo-cross.piral.io"
    codeLink="https://github.com/smapiot/piral/tree/master/src/samples/sample-cross-fx">
    <p>
      An example app based on <code>piral-core</code>.
    </p>
    <blockquote>
      <p>Pilets are fetched dynamically. The available converters are demonstrated.</p>
    </blockquote>
    <p>
      The sample shows the essential use of piral-core with a very simple layout and a variety of (integrated) pilets
      that use most of the core pilet API functions. Additionally, some of the available (opt-in) plugins are shown,
      such as piral-ng (Angular API) and piral-vue (Vue API).
    </p>
    <img className="responsive-image" src={require('../assets/demo-cross.png')} alt="Cross Framework Demo" />
    <p>
      There are no backend connections, however, to demonstrate lazy loading and other covenience factors effectively a
      bit of artificial delay here and there may have been added.
    </p>
    <p>
      To show interaction between different frameworks extensions are used. Some links and simple interactivity are
      there to show the concepts.
    </p>
  </Demo>
);

const MifeDemo: React.FC = () => (
  <Demo
    title="Microfrontends Webshop"
    appLink="https://mife-demo.florian-rappl.de"
    codeLink="https://github.com/FlorianRappl/piral-microfrontend-demo">
    <p>
      An example app based on <code>piral</code>.
    </p>
    <blockquote>
      <p>A rebuild of the famous webshop example - all integrated in one repository.</p>
    </blockquote>
    <p>
      The sample shows how simple a microfrontend app can be set up and created; especially if the app shell does not
      give any design. Pilets exchange components via extensions and everything just works.
    </p>
    <img className="responsive-image" src={require('../assets/demo-mife.png')} alt="Microfrontends Demo" />
    <p>
      The styling of the given application was all inspired from the original demo. The code was written from scratch in
      React to illustrate how much simpler the code could look like.
    </p>
  </Demo>
);

export default () => (
  <section className="container">
    <p>
      The following samples are available to see what Piral can bring to the table. The main focus of the samples is to
      teach the different concepts and introduce some common practices.
    </p>
    <p>
      The provided examples are not properly designed (as in styled). Styling can be fully customized for your needs
      anyway. The whole UX can be adjusted as desired. Nevertheless, the shown UX can be achieved with little to no
      effort.
    </p>
    <div className="demos">
      <CoreDemo />
      <FullDemo />
      <CrossDemo />
      <MifeDemo />
    </div>
  </section>
);
