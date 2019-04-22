import * as React from 'react';
import { LoaderProps } from 'piral-core';
import { useTranslation } from './hooks';

export const Loader: React.SFC<LoaderProps> = () => {
  const { loading } = useTranslation();
  return (
    <pi-center>
      <pi-spinner>{loading}</pi-spinner>
    </pi-center>
  );
};
