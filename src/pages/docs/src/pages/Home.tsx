import * as React from 'react';
import { Link } from 'react-router-dom';

const urls = {
  introvideo: 'https://www.youtube.com/embed/SkKvpBHy_5I',
  codesandbox:
    'https://codesandbox.io/embed/winter-star-is6nx?autoresize=1&previewwindow=tests&fontsize=14&module=%2Fsrc%2Fpilets%2Fsample.tsx&moduleview=1&view=editor',
  logrocket: 'https://blog.logrocket.com/taming-the-front-end-monolith-dbaede402c39/',
  devto: 'https://dev.to/florianrappl/microfrontends-based-on-react-4oo9',
  bitdev: 'https://blog.bitsrc.io/building-react-microfrontends-using-piral-c26eb206310e',
};

export default () => (
  <section className="container">
    <h1>Piral Documentation</h1>
    <div className="markdown-body">
      <p>
        Piral is a framework for developing microfrontends based on React. We value great developer experience and
        appreciate a serverless approach requiring the least amount of infrastructure.
      </p>
      <p>
        A Piral application will be extended at runtime with features coming from independent modules, which we call{' '}
        <i>pilets</i>.
      </p>
      <div className="boxes title-cards">
        <div className="title-card">
          <div className="embed-responsive embed-responsive-16by9">
            <iframe
              className="embed-responsive-item youtube-player"
              width="640"
              height="390"
              itemType="text/html"
              src={urls.introvideo}
              allowFullScreen={false}
            />
          </div>
        </div>
        <div className="title-card small">
          <h4>All Activities</h4>
          <ul className="badges">
            <li>
              <a href="https://dev.to/t/piral" target="_blank">
                <img src="https://img.shields.io/badge/piral-blog-brightgreen" alt="Blog Posts" />
              </a>
            </li>
            <li>
              <a href="https://www.npmjs.com/package/piral-cli" target="_blank">
                <img src="https://img.shields.io/npm/dm/piral-cli" alt="NPM Monthly Downloads" />
              </a>
            </li>
            <li>
              <a href="https://github.com/smapiot/piral/issues/" target="_blank">
                <img src="https://img.shields.io/github/issues/smapiot/piral.svg" alt="Piral GitHub Issues" />
              </a>
            </li>
            <li>
              <a href="https://github.com/smapiot/piral/pull/" target="_blank">
                <img src="https://img.shields.io/github/issues-pr/smapiot/piral.svg" alt="Piral GitHub Pull Requests" />
              </a>
            </li>
            <li>
              <a href="https://github.com/smapiot/piral/releases/" target="_blank">
                <img src="https://img.shields.io/github/tag/smapiot/piral.svg" alt="Piral GitHub Releases" />
              </a>
            </li>
            <li>
              <a href="https://gitter.im/piral-io/community" target="_blank">
                <img src="https://badges.gitter.im/gitterHQ/gitter.png" alt="Piral Gitter Chat" />
              </a>
            </li>
          </ul>
        </div>
        <div className="title-card small">
          <h4>Quick Links</h4>
          <p>
            <Link to="/tutorials" className="btn primary">
              <i className="fas fa-book" /> Tutorials
            </Link>
          </p>
          <p>
            <Link to="/reference" className="btn primary">
              <i className="fas fa-info-circle" /> References
            </Link>
          </p>
          <p>
            <Link to="/samples" className="btn primary">
              <i className="fas fa-desktop" /> Samples
            </Link>
          </p>
          <p>
            <Link to="/faq" className="btn primary">
              <i className="fas fa-question-circle" /> FAQ
            </Link>
          </p>
        </div>
      </div>
      <p>
        Learn more in <Link to="/tutorials/01-introduction">the introduction tutorial</Link>.
      </p>
      <h2>Getting Started</h2>
      <p>
        Piral tries to make it as simple as possible to get started. Our tooling helps you to get off the ground in no
        time.
      </p>
      <p>
        Learn more in <Link to="/tutorials/02-getting-started">the getting started tutorial</Link>.
      </p>
      <h3>Prerequisites</h3>
      <p>For Piral you need:</p>
      <ul>
        <li>Node.js (v10+ recommended)</li>
        <li>NPM</li>
      </ul>
      <h3>Overall Architecture</h3>
      <p>A microfrontend solution with Piral usually consists of three parts:</p>
      <ol>
        <li>Your application shell (Piral instance)</li>
        <li>A feed service to deliver information about the microfrontends</li>
        <li>The pilets to actually represent the microfrontends</li>
      </ol>
      <p>The following diagram illustrates this form a high-level point of view.</p>
      <img src={require('../../../../../docs/diagrams/architecture-overview.png')} alt="Architecture Overview Piral" />
      <h3>Your Application Shell</h3>
      <p>
        To create a new application shell just open a new terminal, create a new folder and run the following command:
      </p>
      <pre>
        <code className="hljs language-sh">npm init piral-instance</code>
      </pre>
      <p>
        Confirm all options by pressing <kbd>ENTER</kbd>. This will scaffold a new Piral instance, i.e., an application
        shell using Piral.
      </p>
      <p>Now start the debugging to confirm everything was set up properly:</p>
      <pre>
        <code className="hljs language-sh">npm start</code>
      </pre>
      <p>
        There should be a server running at <a href="http://localhost:1234">localhost:1234</a>. Make sure everything
        looks good!
      </p>
      <p>If everything looks great it's time to build the application:</p>
      <pre>
        <code className="hljs language-sh">npm run build</code>
      </pre>
      <p>This gives us two folders:</p>
      <ul>
        <li>
          <i>dist/develop</i> contains a <b>.tgz</b> file for developing pilets
        </li>
        <li>
          <i>dist/release</i> contains the files for production use on a webserver
        </li>
      </ul>
      <p>
        For more information, e.g., about <Link to="/tutorials/06-piral-layout">changing the layout</Link> visit the
        tutorials.
      </p>
      <p>At this point the application shell of our new project using Piral is online.</p>
      <img
        src={require('../../../../../docs/diagrams/architecture-appshell.png')}
        alt="Architecture Application Shell Piral"
      />
      <h3>Your First Pilet</h3>
      <p>
        With the application shell created we can start development on our first pilet. Create a new folder and run the
        following command:
      </p>
      <pre>
        <code className="hljs language-sh">npm init pilet</code>
      </pre>
      <p>
        <b>Important:</b> Don't press <kbd>ENTER</kbd> for all options. Specify the Piral instance explicity by giving
        it a (relative or absolute) path to the previously created <b>.tgz</b> file.
      </p>
      <p>Now start the debugging to confirm everything was set up properly:</p>
      <pre>
        <code className="hljs language-sh">npm start</code>
      </pre>
      <p>
        Again, we can access this at <a href="http://localhost:1234">localhost:1234</a>.
      </p>
      <p>
        Ideally, this should look as before, however, with the difference that the application now contains an
        additional tile, a notification, and a menu link.
      </p>
      <p>
        The extra functionality was added in the <code>src/index.tsx</code> using the Pilet API. Learn more about it in{' '}
        <Link to="/tutorials/04-the-pilet-api">the Pilet API tutorial</Link>.
      </p>
      <p>
        Building an publishing can be done in one command. Learn more about publishing in{' '}
        <Link to="/tutorials/03-publishing-pilets">the publishing tutorial</Link>.
      </p>
      <p>This covers the creation of the different microfrontends or modules called pilets.</p>
      <img src={require('../../../../../docs/diagrams/architecture-modules.png')} alt="Architecture Pilets Piral" />
      <h2>Siteless Code Sandbox</h2>
      <p>
        We prepared a little codesandbox using an empty app shell package called <code>siteless</code>. This sandbox
        allows you to easily develop some pilets and play around with their interaction patterns.
      </p>
      <iframe
        src={urls.codesandbox}
        style={{ width: '100%', height: '500px', border: 0, borderRadius: '4px', overflow: 'hidden' }}
        title="Siteless Starter"
        allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr"
        sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
      />
      <h2>More Information</h2>
      <p>
        This should give you a brief look at what developing a microfrontend solution with Piral looks like. In the end,
        Piral tries to get out of your way. All the decisions (incl. full behavior) can be specified. The starter
        boilerplate is just here to give you a head start.
      </p>
      <p>Below you'll find a list of some articles and starters.</p>
      <ul>
        <li>
          <a href={urls.bitdev} target="_blank">
            Bits and Pieces, 11/2019
          </a>
        </li>
        <li>
          <a href={urls.devto} target="_blank">
            dev.to, 11/2019
          </a>
        </li>
        <li>
          <a href={urls.logrocket} target="_blank">
            Logrocket, 02/2019
          </a>
        </li>
      </ul>
    </div>
  </section>
);
