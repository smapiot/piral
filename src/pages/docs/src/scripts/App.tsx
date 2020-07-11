import * as React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { routes } from './sitemap';
import { Layout } from './layout';

export const App = () => (
  <BrowserRouter>
    <Layout>
      <Switch>
        {routes}
        <Redirect exact from="/" to="/guidelines" />
        <Redirect exact from="/tutorials" to="/guidelines" />
        <Redirect exact from="/tutorials/:id" to="/guidelines/tutorials/:id" />
        <Redirect exact from="/reference/tooling/pilet" to="/tooling/build-pilet" />
        <Redirect exact from="/reference/tooling/piral" to="/tooling/build-piral" />
        <Redirect exact from="/reference/extensions/:id?" to="/plugins/:id" />
        <Redirect exact from="/reference/plugins/:id?" to="/plugins/:id" />
        <Redirect exact from="/code/:id" to="/reference/codes/:id" />
        <Route component={React.lazy(() => import('../pages/NotFound'))} />
      </Switch>
    </Layout>
  </BrowserRouter>
);
