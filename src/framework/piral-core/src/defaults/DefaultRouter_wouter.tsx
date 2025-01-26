import * as React from 'react';
//@ts-ignore
import { Router } from 'wouter';
import { RouterProps } from '../types';

export const DefaultRouter: React.FC<RouterProps> = ({ children, publicPath }) => {
  return <Router base={publicPath}>{children}</Router>;
};
DefaultRouter.displayName = 'DefaultRouter';
