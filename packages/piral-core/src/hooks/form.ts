import { useContext } from 'react';
import { History } from 'history';
import { useGlobalState } from './globalState';
import { usePrompt } from './prompt';
import { StateContext } from '../state/stateContext';
import { compare } from '../utils';
import { FormDetails, FormProps } from '../types';

/**
 * Hook that returns the created form.
 * @param options The options for retrieving the form.
 * @param history The history to use for blocking navigation.
 */
export function useForm<TFormData>(options: FormDetails<TFormData>, history: History): FormProps<TFormData> {
  const { changed, currentData, initialData, submitting, error } = useGlobalState(s => s.forms[options.id]);
  const { resetForm, changeForm } = useContext(StateContext);
  usePrompt(!options.silent && changed, history, options.message);
  return {
    changed,
    submitting,
    error,
    formData: currentData,
    reset() {
      resetForm(options.id, initialData);
    },
    setFormData(data) {
      if (initialData === undefined) {
        resetForm(options.id, initialData);
      } else {
        const hasChanged = !compare(data, initialData);
        changeForm(options.id, data, hasChanged);
      }
    },
    submit() {
      if (changed) {
        options.onSubmit(currentData);
      }
    },
  };
}
