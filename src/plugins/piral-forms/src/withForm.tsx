import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { PiralLoadingIndicator, PiralError, usePromise } from 'piral-core';
import { useForm } from './useForm';
import { InputFormOptions, FormProps } from './types';

export function withForm<TFormData, TProps>(
  Component: React.ComponentType<TProps & FormProps<TFormData>>,
  options: InputFormOptions<TFormData, TProps>,
): React.FC<TProps> {
  const FormView: React.FC<TProps & RouteComponentProps & { initialData: TFormData }> = props => {
    const formProps = useForm(props.initialData, props.history, options);
    return (
      <form onSubmit={formProps.submit}>
        <Component {...props} {...formProps} />
      </form>
    );
  };
  const FormLoader: React.FC<TProps & RouteComponentProps> = props => {
    const { loadData, emptyData } = options;
    const { loading, data, error } = usePromise(() =>
      typeof loadData !== 'function' ? Promise.resolve(emptyData) : loadData(props),
    );

    if (loading) {
      return <PiralLoadingIndicator />;
    } else if (data) {
      return <FormView {...props} initialData={data} />;
    } else {
      return <PiralError type="form" error={error} />;
    }
  };

  return withRouter(FormLoader) as any;
}
