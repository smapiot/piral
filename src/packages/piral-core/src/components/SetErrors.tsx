import * as React from 'react';
import { SetError } from './SetError';
import { ErrorComponentsState } from '../types';

export interface SetErrorsProps {
  /**
   * The error views of the Piral instance.
   */
  errors?: Partial<ErrorComponentsState>;
}

export function SetErrors({ errors = {} }: SetErrorsProps): React.ReactElement {
  return (
    <>
      {Object.keys(errors).map((key: any) => (
        <SetError type={key} component={errors[key]} key={key} />
      ))}
    </>
  );
}
