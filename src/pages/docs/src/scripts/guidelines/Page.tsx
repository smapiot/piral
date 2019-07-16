import * as React from 'react';
import { Switch, Route, RouteComponentProps } from 'react-router-dom';
import { Standard } from '../layout';

const Overview = React.lazy(() => import('./Overview'));
/* start:auto-generated */
const FirstPilet = React.lazy(() => import('./FirstPilet'));
const ServerSideRendering = React.lazy(() => import('./ServerSideRendering'));
const StaticPiralInstance = React.lazy(() => import('./StaticPiralInstance'));
/* end:auto-generated */

function capitalize(str: string) {
  return str[0].toUpperCase() + str.substr(1);
}

function getName(path: string) {
  const index = path.lastIndexOf('/');
  const parts = path.substr(index + 1).split('-');
  return parts.map(m => capitalize(m)).join(' ');
}

export const Page: React.FC<RouteComponentProps> = ({ location }) => {
  const rootPath = '/guidelines';
  const rootTitle = 'Guidelines';
  const isOverview = location.pathname === rootPath;

  return (
    <Standard
      kind="primary"
      title={isOverview ? rootTitle : getName(location.pathname)}
      icon="monument"
      breadcrumbs={isOverview ? [] : [{ title: rootTitle, to: rootPath }]}>
      <Switch>
        <Route exact path="/guidelines" component={Overview} />
        {/* start:auto-generated */}
        <Route exact path="/guidelines/first-pilet" component={FirstPilet} />
        <Route exact path="/guidelines/server-side-rendering" component={ServerSideRendering} />
        <Route exact path="/guidelines/static-piral-instance" component={StaticPiralInstance} />
        {/* end:auto-generated */}
      </Switch>
    </Standard>
  );
};
