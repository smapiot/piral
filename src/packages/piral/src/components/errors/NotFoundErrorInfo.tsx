import * as React from 'react';
import { NotFoundErrorInfoProps } from 'piral-core';
import { useTranslation } from '../../hooks';

export const NotFoundErrorInfo: React.SFC<NotFoundErrorInfoProps> = props => {
  const { notFoundErrorTitle, notFoundErrorDescription } = useTranslation();
  //props.location.pathname

  return (
    <pi-error>
      <pi-title>{notFoundErrorTitle}</pi-title>
      <pi-description>{notFoundErrorDescription}</pi-description>
    </pi-error>
  );
};
