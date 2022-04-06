import * as React from 'react';
import { RegisteredErrorInfo, RegisteredLoadingIndicator } from './components';
import { useGlobalState } from '../hooks';

export const PiralSuspense: React.FC = ({ children }) => {
  const { error, loading } = useGlobalState((m) => m.app);

  return error ? (
    <RegisteredErrorInfo type="loading" error={error} />
  ) : loading ? (
    <RegisteredLoadingIndicator />
  ) : (
    <>{children}</>
  );
};
