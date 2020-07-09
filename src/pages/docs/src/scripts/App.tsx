import * as React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { routes } from './sitemap';
import { Layout } from './layout';

const NotFoundPage = React.lazy(() => import('../pages/NotFound'));

export const App = () => (
  <BrowserRouter>
    <Layout>
      <Switch>
        {routes}
        <Redirect exact from="/" to="/guidelines" />
        <Redirect exact from="/tutorials" to="/guidelines" />
        <Redirect exact from="/reference/extensions/:id?" to="/plugins/:id" />
        <Redirect exact from="/reference/plugins/:id?" to="/plugins/:id" />
        <Redirect exact from="/code/:id" to="/reference/codes/:id" />
        <Route component={NotFoundPage} />
      </Switch>
    </Layout>
  </BrowserRouter>
);
