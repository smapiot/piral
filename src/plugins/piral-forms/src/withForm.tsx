import * as React from 'react';
import { RegisteredLoadingIndicator, RegisteredErrorInfo, useGlobalStateContext } from 'piral-core';
import { useForm } from './useForm';
import { usePromise } from './usePromise';
import { InputFormOptions, FormProps } from './types';

export function withForm<TFormData, TRequiredProps, TProps extends TRequiredProps>(
  Component: React.ComponentType<TProps & FormProps<TFormData>>,
  options: InputFormOptions<TFormData, TRequiredProps>,
): React.FC<TProps> {
  const FormView: React.FC<TProps & { initialData: TFormData }> = (props) => {
    const { navigation } = useGlobalStateContext();
    const formProps = useForm(props.initialData, navigation, options);
    return (
      <form onSubmit={formProps.submit}>
        <Component {...props} {...formProps} />
      </form>
    );
  };
  const FormLoader: React.FC<TProps> = (props) => {
    const { loadData, emptyData } = options;
    const { loading, data, error } = usePromise(() =>
      typeof loadData !== 'function' ? Promise.resolve(emptyData) : loadData(props),
    );

    if (loading) {
      return <RegisteredLoadingIndicator />;
    } else if (data) {
      return <FormView {...props} initialData={data} />;
    } else {
      return <RegisteredErrorInfo type="form" error={error} />;
    }
  };
  FormLoader.displayName = `withForm(${Component.displayName ?? 'Component'})`;

  return FormLoader;
}
