import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useGlobalState } from '../hooks';

export const DefaultRouter: React.FC = ({ children }) => {
  const publicPath = useGlobalState((s) => s.app.publicPath);
  return <BrowserRouter basename={publicPath}>{children}</BrowserRouter>;
};
