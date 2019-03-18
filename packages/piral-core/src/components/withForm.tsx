import * as React from 'react';
import { useState, useEffect } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { usePrompt } from '../hooks';
import { InputFormOptions, FormProps } from '../types';
import { compare } from '../utils';

export function withForm<TFormData, TProps>(
  Component: React.ComponentType<TProps & FormProps<TFormData>>,
  options: InputFormOptions<TFormData>,
): React.ComponentType<TProps> {
  const { message, silent, initialData } = options;

  const FormView: React.SFC<TProps & RouteComponentProps> = props => {
    const [oldData, setOldData] = useState(initialData);
    const [data, setData] = useState(initialData);
    const [changed, setChanged] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(undefined);
    const submit = (e?: React.FormEvent) => {
      e && e.preventDefault();

      if (changed) {
        setChanged(false);
        setSubmitting(true);
      }

      return false;
    };
    usePrompt(!silent && changed, props.history, message);
    useEffect(() => {
      let cancelled = false;

      if (submitting) {
        const worker = options.onSubmit(data);
        Promise.resolve(worker)
          .then(() => {
            if (!cancelled) {
              setOldData(data);
              setChanged(false);
              setSubmitting(false);
            }
          })
          .catch(error => {
            if (!cancelled) {
              setError(error);
              setChanged(true);
              setSubmitting(false);
            }
          });
      }

      return () => {
        cancelled = true;
      };
    }, [submitting]);
    return (
      <form onSubmit={submit}>
        <Component
          {...props}
          changed={changed}
          formData={data}
          submitting={submitting}
          error={error}
          submit={submit}
          reset={() => {
            setData(oldData);
            setChanged(false);
            setError(undefined);
          }}
          setFormData={updatedData => {
            const newData = { ...data, ...updatedData };
            setData(newData);
            setChanged(!compare(newData, oldData));
            setError(undefined);
          }}
          changeForm={e => {
            const { name, value } = e.target;
            const newData = { ...data, [name]: value };
            setData(newData);
            setChanged(!compare(newData, oldData));
            setError(undefined);
          }}
        />
      </form>
    );
  };

  return withRouter(FormView) as any;
}
