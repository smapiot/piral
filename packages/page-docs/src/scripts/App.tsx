import * as React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Page as DocumentationPage } from './documentation';
import { Page as QuestionsPage } from './questions';
import { Page as LandingPage } from './landing';

export const App = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={LandingPage} />
      <Route exact path="/documentation" component={DocumentationPage} />
      <Route exact path="/questions" component={QuestionsPage} />
    </Switch>
  </BrowserRouter>
);
