import * as React from 'react';
import { Switch, Route, RouteComponentProps } from 'react-router-dom';
import { Standard } from '../layout';

const Overview = React.lazy(() => import('./Overview'));
/* start:auto-generated */
const PiletSpecification = React.lazy(() => import('./PiletSpecification'));
const PiralAPISpecification = React.lazy(() => import('./PiralAPISpecification'));
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
  const rootPath = '/specifications';
  const rootTitle = 'Specifications';
  const isOverview = location.pathname === rootPath;

  return (
    <Standard
      kind="blue"
      title={isOverview ? rootTitle : getName(location.pathname)}
      icon="puzzle-piece"
      breadcrumbs={isOverview ? [] : [{ title: rootTitle, to: rootPath }]}>
      <Switch>
        <Route exact path="/specifications" component={Overview} />
        {/* start:auto-generated */}
        <Route exact path="/specifications/pilet-specification" component={PiletSpecification} />
        <Route exact path="/specifications/piral-api-specification" component={PiralAPISpecification} />
        {/* end:auto-generated */}
      </Switch>
    </Standard>
  );
};
