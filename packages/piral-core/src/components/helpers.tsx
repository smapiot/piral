import * as React from 'react';
import { useGlobalState } from '../hooks';
import { ErrorInfoProps } from '../types';

export const ComponentError: React.SFC<ErrorInfoProps> = props => {
  const { ErrorInfo } = useGlobalState(s => s.app.components);
  return <ErrorInfo {...props} />;
};

export const ComponentLoader: React.SFC = () => {
  const { Loader } = useGlobalState(s => s.app.components);
  return <Loader />;
};
