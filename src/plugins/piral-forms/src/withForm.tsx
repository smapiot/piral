import * as React from 'react';

import { withFormHandler } from './withFormHandler';
import type { InputFormOptions, FormProps } from './types';

export function withForm<TFormData, TRequiredProps, TProps extends TRequiredProps>(
  Component: React.ComponentType<TProps & FormProps<TFormData>>,
  options: InputFormOptions<TFormData, TRequiredProps>,
): React.FC<TProps> {
  const WrappedComponent = withFormHandler<TFormData, TRequiredProps, TProps>(
    (props) => (
      <form onSubmit={props.submit}>
        <Component {...props} />
      </form>
    ),
    options,
  );
  WrappedComponent.displayName = `withForm(${Component.displayName ?? 'Component'})`;
  return WrappedComponent;
}
