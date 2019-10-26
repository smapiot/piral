import * as React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { Layout } from './layout';

const TutorialsPage = React.lazy(() => import('../pages/Tutorials'));
const ReferencePage = React.lazy(() => import('../pages/References'));
const DocumentationReferencePage = React.lazy(() => import('../pages/Documentation'));
const TypeReferencePage = React.lazy(() => import('../pages/Types'));
const SpecificationReferencePage = React.lazy(() => import('../pages/Specification'));
const ToolingReferencePage = React.lazy(() => import('../pages/Tooling'));
const ExtensionsReferencePage = React.lazy(() => import('../pages/Extensions'));
const SamplesPage = React.lazy(() => import('../pages/Samples'));
const FaqPage = React.lazy(() => import('../pages/Faq'));
const NotFoundPage = React.lazy(() => import('../pages/NotFound'));

const tutorials = require('../codegen/tutorials.codegen');
const extensions = require('../codegen/extensions.codegen');

export const App = () => (
  <BrowserRouter>
    <Layout>
      <Switch>
        <Redirect exact from="/" to="/tutorials" />
        <Route exact path="/tutorials" component={TutorialsPage} />
        {tutorials.map(tutorial => (
          <Route key={tutorial.id} exact path={tutorial.route} component={tutorial.page} />
        ))}
        <Route exact path="/reference" component={ReferencePage} />
        <Route exact path="/reference/documentation" component={DocumentationReferencePage} />
        <Route exact path="/reference/types" component={TypeReferencePage} />
        <Route exact path="/reference/specifications" component={SpecificationReferencePage} />
        <Route exact path="/reference/tooling" component={ToolingReferencePage} />
        <Route exact path="/reference/extensions" component={ExtensionsReferencePage} />
        {extensions.map(extension => (
          <Route key={extension.id} exact path={extension.route} component={extension.page} />
        ))}
        <Route exact path="/samples" component={SamplesPage} />
        <Route exact path="/faq" component={FaqPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </Layout>
  </BrowserRouter>
);
