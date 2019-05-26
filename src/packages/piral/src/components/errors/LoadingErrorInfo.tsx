import * as React from 'react';
import { LoadingErrorInfoProps } from 'piral-core';
import { useTranslation } from '../../hooks';

export const LoadingErrorInfo: React.SFC<LoadingErrorInfoProps> = props => {
  const { loadingErrorTitle, loadingErrorDescription } = useTranslation();

  return (
    <pi-error>
      <pi-title>{loadingErrorTitle}</pi-title>
      <pi-description>{loadingErrorDescription}</pi-description>
    </pi-error>
  );
};
