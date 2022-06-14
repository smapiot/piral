import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useGlobalState } from '../hooks';
import { RouterProps } from '../types';

export const DefaultRouter: React.FC<RouterProps> = ({ children }) => {
  const publicPath = useGlobalState((s) => s.app.publicPath);
  return <BrowserRouter basename={publicPath}>{children}</BrowserRouter>;
};
DefaultRouter.displayName = 'DefaultRouter';
