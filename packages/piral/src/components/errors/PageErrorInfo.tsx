import * as React from 'react';
import { PageErrorInfoProps } from 'piral-core';
import { useTranslation } from '../hooks';

export const PageErrorInfo: React.SFC<PageErrorInfoProps> = props => {
  const { pageErrorTitle, pageErrorDescription } = useTranslation();

  return (
    <pi-error>
      <pi-title>{pageErrorTitle}</pi-title>
      <pi-description>{pageErrorDescription}</pi-description>
    </pi-error>
  );
};
