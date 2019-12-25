import 'core-js/es7/reflect';
import 'zone.js/dist/zone';
import '@webcomponents/webcomponentsjs/webcomponents-loader';
import '@webcomponents/webcomponentsjs/webcomponents-bundle.js';
import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter';

import * as React from 'react';
import { render } from 'react-dom';
import { Link, RouteComponentProps } from 'react-router-dom';
import { createInstance, useGlobalState, LoadingIndicatorProps, Piral, SetComponent, SetRoute } from 'piral-core';
import { createVueApi } from 'piral-vue';
import { createNgApi } from 'piral-ng';
import { createNgjsApi } from 'piral-ngjs';
import { createHyperappApi } from 'piral-hyperapp';
import { createInfernoApi } from 'piral-inferno';
import { createPreactApi } from 'piral-preact';
import { createLitElApi } from 'piral-litel';
import { createMithrilApi } from 'piral-mithril';
import { createAureliaApi } from 'piral-aurelia';
import { createRiotApi } from 'piral-riot';
import { createDashboardApi, Dashboard } from 'piral-dashboard';
import { availablePilets } from './pilets';

const Loader: React.FC<LoadingIndicatorProps> = () => (
  <div className="app-center">
    <div className="spinner circles">Loading ...</div>
  </div>
);

const Sitemap: React.FC<RouteComponentProps> = () => {
  const pages = useGlobalState(s => s.registry.pages);

  return (
    <ul>
      <li>
        <Link to="/">Go to /</Link>
      </li>
      {Object.keys(pages)
        .map(url => url.replace(':id', `${~~(Math.random() * 1000)}`))
        .map(url => (
          <li key={url}>
            <Link to={url}>Go to {url}</Link>
          </li>
        ))}
      <li>
        <Link to="/sitemap">Go to /sitemap</Link>
      </li>
      <li>
        <Link to="/not-found">Go to /not-found</Link>
      </li>
    </ul>
  );
};

const DashboardContainer: React.FC = ({ children }) => <div className="tiles">{children}</div>;

const Layout: React.FC = ({ children }) => (
  <div className="app-container">
    <div className="app-header">
      <h1>Cross Framework Sample</h1>
    </div>
    <div className="app-content">{children}</div>
    <div className="app-footer">For more information or the source code check out our GitHub repository.</div>
  </div>
);

const instance = createInstance({
  availablePilets,
  extendApi: [
    createVueApi(),
    createNgApi(),
    createNgjsApi(),
    createHyperappApi(),
    createInfernoApi(),
    createPreactApi(),
    createLitElApi(),
    createMithrilApi(),
    createAureliaApi(),
    createRiotApi(),
    createDashboardApi(),
  ],
  requestPilets() {
    return Promise.resolve([]);
  },
});

const app = (
  <Piral instance={instance}>
    <SetComponent name="LoadingIndicator" component={Loader} />
    <SetComponent name="Layout" component={Layout} />
    <SetComponent name="DashboardContainer" component={DashboardContainer} />
    <SetRoute path="/" component={Dashboard} />
    <SetRoute path="/sitemap" component={Sitemap} />
  </Piral>
);
render(app, document.querySelector('#app'));
