import * as React from 'react';
//@ts-ignore
import { Routes, Route, useParams, useLocation, useNavigate } from 'react-router';
import { RouteSwitchProps } from '../types';

function getHistory(navigate: any): any {
  return {
    push(path: string, state: any) {
      navigate(path, { replace: false, state });
    },
    replace(path: string, state: any) {
      navigate(path, { replace: true, state });
    },
  };
}

interface RouteContentWrapperProps {
  Component: RouteSwitchProps['paths'][0]['Component'];
}

const RouteContentWrapper: React.FC<RouteContentWrapperProps> = ({ Component }) => {
  const navigate = useNavigate();
  const params = useParams();
  const loc = useLocation();

  return (
    <Component
      history={getHistory(navigate)}
      location={loc}
      match={{ params, isExact: true, path: loc.pathname, url: location.href }}
    />
  );
};

export const DefaultRouteSwitch: React.FC<RouteSwitchProps> = ({ paths, NotFound, ...props }) => {
  return (
    <Routes {...props}>
      {paths.map(({ path, Component }) => (
        //@ts-ignore
        <Route key={path} path={path} element={<RouteContentWrapper Component={Component} />} />
      ))}
      {
        //@ts-ignore
        <Route path="*" element={<NotFound />} />
      }
    </Routes>
  );
};
DefaultRouteSwitch.displayName = 'DefaultRouteSwitch';
