import * as React from 'react';
//@ts-ignore
import { BrowserRouter } from 'react-router';
import { RouterProps } from '../types';

export const DefaultRouter: React.FC<RouterProps> = ({ children, publicPath }) => {
  return <BrowserRouter basename={publicPath}>{children}</BrowserRouter>;
};
DefaultRouter.displayName = 'DefaultRouter';
