import * as React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Loader } from './components';

const LandingPage = React.lazy(() => import('./landing'));
const DocumentationPage = React.lazy(() => import('./documentation'));
const SpecificationsPage = React.lazy(() => import('./specifications'));
const GuidelinesPage = React.lazy(() => import('./guidelines'));
const ToolingPage = React.lazy(() => import('./tooling'));
const SamplesPage = React.lazy(() => import('./samples'));
const TypesPage = React.lazy(() => import('./types'));
const QuestionsPage = React.lazy(() => import('./questions'));
const NotFoundPage = React.lazy(() => import('./notfound'));

export const App = () => (
  <BrowserRouter>
    <React.Suspense fallback={<Loader />}>
      <Switch>
        <Route exact path="/" component={LandingPage} />
        <Route path="/documentation" component={DocumentationPage} />
        <Route path="/specifications" component={SpecificationsPage} />
        <Route path="/guidelines" component={GuidelinesPage} />
        <Route path="/tooling" component={ToolingPage} />
        <Route path="/questions" component={QuestionsPage} />
        <Route path="/types" component={TypesPage} />
        <Route path="/samples" component={SamplesPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </React.Suspense>
  </BrowserRouter>
);
