import * as React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { Layout } from './layout';

const HomePage = React.lazy(() => import('../pages/Home'));
const TutorialsPage = React.lazy(() => import('../pages/Tutorials'));
const ReferencePage = React.lazy(() => import('../pages/References'));
const DocumentationReferencePage = React.lazy(() => import('../pages/Documentation'));
const TypeReferencePage = React.lazy(() => import('../pages/Types'));
const SpecificationReferencePage = React.lazy(() => import('../pages/Specification'));
const ToolingReferencePage = React.lazy(() => import('../pages/Tooling'));
const PluginsReferencePage = React.lazy(() => import('../pages/Extensions'));
const SamplesPage = React.lazy(() => import('../pages/Samples'));
const FaqPage = React.lazy(() => import('../pages/Faq'));
const NotFoundPage = React.lazy(() => import('../pages/NotFound'));

const tutorials = require('../codegen/tutorials.codegen');
const plugins = require('../codegen/extensions.codegen');

export const App = () => (
  <BrowserRouter>
    <Layout>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/tutorials" component={TutorialsPage} />
        {tutorials.map(tutorial => (
          <Route key={tutorial.id} exact path={tutorial.route} component={tutorial.page} />
        ))}
        <Route exact path="/reference" component={ReferencePage} />
        <Route exact path="/reference/documentation" component={DocumentationReferencePage} />
        <Route exact path="/reference/types/:tab?" component={TypeReferencePage} />
        <Route exact path="/reference/specifications/:tab?" component={SpecificationReferencePage} />
        <Route exact path="/reference/tooling/:tab?" component={ToolingReferencePage} />
        <Route exact path="/reference/plugins" component={PluginsReferencePage} />
        {plugins.map(plugin => (
          <Route key={plugin.id} exact path={plugin.route} component={plugin.page} />
        ))}
        <Route exact path="/samples" component={SamplesPage} />
        <Route exact path="/faq" component={FaqPage} />
        <Redirect from="/reference/extensions" to="/reference/plugins" />
        <Route component={NotFoundPage} />
      </Switch>
    </Layout>
  </BrowserRouter>
);
