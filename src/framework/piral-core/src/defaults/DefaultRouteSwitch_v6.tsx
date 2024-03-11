import * as React from 'react';
//@ts-ignore
import { Routes, Route } from 'react-router-dom';
import { RouteSwitchProps } from '../types';

export const DefaultRouteSwitch: React.FC<RouteSwitchProps> = ({ paths, NotFound, ...props }) => {
  return (
    <Routes {...props}>
      {paths.map(({ path, Component }) => (
        //@ts-ignore
        <Route key={path} path={path} element={<Component />} />
      ))}
      {
        //@ts-ignore
        <Route path="*" element={<NotFound />} />
      }
    </Routes>
  );
};
DefaultRouteSwitch.displayName = 'DefaultRouteSwitch';
