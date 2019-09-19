import * as React from 'react';
import { useGlobalState } from '../hooks';
import { ErrorInfoProps } from '../types';

export const ComponentError: React.FC<ErrorInfoProps<any>> = props => {
  const { ErrorInfo } = useGlobalState(s => s.app.components);
  return <ErrorInfo {...props} />;
};

export const ComponentLoader: React.FC = () => {
  const { Loader } = useGlobalState(s => s.app.components);
  return <Loader />;
};
