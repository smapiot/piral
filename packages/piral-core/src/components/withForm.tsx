import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useForm, useGlobalState, usePromise } from '../hooks';
import { InputFormOptions, FormProps } from '../types';

export function withForm<TFormData, TProps>(
  Component: React.ComponentType<TProps & FormProps<TFormData>>,
  options: InputFormOptions<TFormData, TProps>,
): React.ComponentType<TProps> {
  const FormView: React.SFC<TProps & RouteComponentProps & { initialData: TFormData }> = props => {
    const formProps = useForm(props.initialData, props.history, options);
    return (
      <form onSubmit={formProps.submit}>
        <Component {...props} {...formProps} />
      </form>
    );
  };
  const FormLoader: React.SFC<TProps & RouteComponentProps> = props => {
    const { loadData, emptyData } = options;
    const { Loader, ErrorInfo } = useGlobalState(s => s.app.components);
    const { loading, data, error } = usePromise(() =>
      typeof loadData !== 'function' ? Promise.resolve(emptyData) : loadData(props),
    );

    if (loading) {
      return <Loader />;
    } else if (data) {
      return <FormView {...props} initialData={data} />;
    } else {
      return <ErrorInfo type="form" error={error} />;
    }
  };

  return withRouter(FormLoader) as any;
}
