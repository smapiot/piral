import 'core-js/es7/reflect';
import 'zone.js/dist/zone';
import '@webcomponents/webcomponentsjs/webcomponents-loader';
import '@webcomponents/webcomponentsjs/webcomponents-bundle.js';
import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter';

import * as React from 'react';
import { render } from 'react-dom';
import { createInstance, LoadingIndicatorProps, Piral, SetComponent, SetRoute } from 'piral-core';
import { createVueApi } from 'piral-vue';
import { createNgApi } from 'piral-ng';
import { createNgjsApi } from 'piral-ngjs';
import { createHyperappApi } from 'piral-hyperapp';
import { createInfernoApi } from 'piral-inferno';
import { createPreactApi } from 'piral-preact';
import { createLazyApi } from 'piral-lazy';
import { createLitElApi } from 'piral-litel';
import { createMithrilApi } from 'piral-mithril';
import { createAureliaApi } from 'piral-aurelia';
import { createRiotApi } from 'piral-riot';
import { createElmApi } from 'piral-elm';
import { createSvelteApi } from 'piral-svelte';
import { createDashboardApi, Dashboard } from 'piral-dashboard';

const Loader: React.FC<LoadingIndicatorProps> = () => (
  <div className="app-center">
    <div className="spinner circles">Loading ...</div>
  </div>
);

const DashboardContainer: React.FC = ({ children }) => <div className="tiles">{children}</div>;

const Layout: React.FC = ({ children }) => (
  <div className="app-container">
    <div className="app-header">
      <h1>Cross Framework Sample</h1>
    </div>
    <div className="app-content">{children}</div>
    <div className="app-footer">
      For more information or the source code check out our{' '}
      <a href="https://github.com/smapiot/piral">GitHub repository</a>.
    </div>
  </div>
);

const instance = createInstance({
  extendApi: [
    createLazyApi(),
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
    createElmApi(),
    createSvelteApi(),
    createDashboardApi(),
  ],
  requestPilets() {
    return fetch('https://feed.piral.cloud/api/v1/pilet/cross-fx')
      .then(res => res.json())
      .then(res => res.items);
  },
});

const app = (
  <Piral instance={instance}>
    <SetComponent name="LoadingIndicator" component={Loader} />
    <SetComponent name="Layout" component={Layout} />
    <SetComponent name="DashboardContainer" component={DashboardContainer} />
    <SetRoute path="/" component={Dashboard} />
  </Piral>
);

render(app, document.querySelector('#app'));
