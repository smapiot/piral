import * as React from 'react';
import { useTranslation } from '../../hooks';

export const UnknownErrorInfo: React.SFC = () => {
  const { unknownErrorTitle, unknownErrorDescription } = useTranslation();

  return (
    <pi-error>
      <pi-title>{unknownErrorTitle}</pi-title>
      <pi-description>{unknownErrorDescription}</pi-description>
    </pi-error>
  );
};
