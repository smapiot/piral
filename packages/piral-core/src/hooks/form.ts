import { useContext } from 'react';
import { History } from 'history';
import { useGlobalState } from './globalState';
import { usePrompt } from './prompt';
import { StateContext } from '../state/stateContext';
import { compare, withKey } from '../utils';
import { FormDetails, FormProps } from '../types';

/**
 * Hook that returns the created form.
 * @param options The options for retrieving the form.
 * @param history The history to use for blocking navigation.
 */
export function useForm<TFormData>(options: FormDetails<TFormData>, history: History): FormProps<TFormData> {
  const { changed, currentData, initialData, submitting, error } = useGlobalState(s => s.forms[options.id]);
  const { resetForm, changeForm, submitForm } = useContext(StateContext);
  const reset = () => resetForm(options.id, initialData);
  usePrompt(!options.silent && changed, history, options.message, reset);
  return {
    changed,
    submitting,
    error,
    formData: currentData,
    reset,
    setFormData(data) {
      if (initialData === undefined) {
        resetForm(options.id, data);
      } else {
        const newData = { ...currentData, ...data };
        const hasChanged = !compare(newData, initialData);
        changeForm(options.id, newData, hasChanged);
      }
    },
    changeForm(e) {
      const { name, value } = e.target;
      const newData = withKey(currentData, name, value);
      const hasChanged = !compare(newData, initialData);
      changeForm(options.id, newData, hasChanged);
    },
    submit(e?: React.FormEvent) {
      e && e.preventDefault();
      changed && submitForm(options.id, options.onSubmit(currentData));
      return false;
    },
  };
}
