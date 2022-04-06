import * as React from 'react';
import { SetError } from './SetError';
import { ErrorComponentsState } from '../types';

/**
 * The props for the SetErrors component.
 */
export interface SetErrorsProps {
  /**
   * The error views of the Piral instance.
   */
  errors?: Partial<ErrorComponentsState>;
}

/**
 * The component capable of batch setting error handling components.
 */
export function SetErrors({ errors = {} }: SetErrorsProps): React.ReactElement {
  return (
    <>
      {Object.keys(errors).map((key: any) => (
        <SetError type={key} component={errors[key]} key={key} />
      ))}
    </>
  );
}
