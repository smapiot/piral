import * as React from 'react';
import { FormErrorInfoProps } from 'piral-core';
import { useTranslation } from '../hooks';

export const FormErrorInfo: React.SFC<FormErrorInfoProps> = props => {
  const { formErrorTitle, formErrorDescription } = useTranslation();

  return (
    <pi-error>
      <pi-title>{formErrorTitle}</pi-title>
      <pi-description>{formErrorDescription}</pi-description>
    </pi-error>
  );
};
