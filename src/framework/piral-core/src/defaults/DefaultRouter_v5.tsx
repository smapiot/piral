import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { RouterProps } from '../types';

export const DefaultRouter: React.FC<RouterProps> = ({ children, publicPath }) => {
  return <BrowserRouter basename={publicPath}>{children}</BrowserRouter>;
};
DefaultRouter.displayName = 'DefaultRouter';
