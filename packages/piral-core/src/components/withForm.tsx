import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useForm } from '../hooks';
import { FormDetails, FormProps } from '../types';

export function withForm<TFormData, TProps>(
  Component: React.ComponentType<TProps & FormProps<TFormData>>,
  options: FormDetails<TFormData>,
): React.ComponentType<TProps> {
  const FormView: React.SFC<TProps & RouteComponentProps> = props => {
    const formProps = useForm(options, props.history);
    return <Component {...props} {...formProps} />;
  };
  FormView.displayName = `FormView_${options.id}`;

  return withRouter(FormView) as any;
}
