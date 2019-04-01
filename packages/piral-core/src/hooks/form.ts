import { useState, useEffect, FormEvent } from 'react';
import { History } from 'history';
import { usePrompt } from './prompt';
import { useAction } from './action';
import { useGlobalState } from './globalState';
import { compare, generateId } from '../utils';
import { FormProps, InputFormOptions } from '../types';

/**
 * Hook for using a form locally that blocks if a transition is performed.
 * @param initialData The initial data of the form.
 * @param history The history to listen / block for changes / transitions.
 * @param options The options used for creating the form.
 * @param existingId The existing id of the form, if any.
 */
export function useForm<TFormData>(
  initialData: TFormData,
  history: History,
  options: InputFormOptions<TFormData, any>,
  existingId?: string,
): FormProps<TFormData> {
  const { silent, message, onSubmit, onChange, wait } = options;
  const defaultState = {
    active: true,
    currentData: initialData,
    initialData,
    changed: false,
    submitting: false,
    error: undefined,
  };
  const [id] = useState(existingId || generateId);
  const state = useGlobalState(m => m.forms[id] || defaultState);
  const updateState = useAction('updateFormState');
  const updateData = (newData: TFormData) => {
    updateState(id, state, {
      currentData: newData,
      changed: !compare(newData, state.initialData),
      error: undefined,
    });

    if (typeof onChange === 'function') {
      Promise.resolve(onChange(newData))
        .then(data => {
          const updatedData = { ...newData, ...data };
          updateState(id, state, {
            currentData: updatedData,
            changed: !compare(updatedData, state.initialData),
            error: undefined,
          });
        })
        .catch(error =>
          updateState(id, state, {
            error,
          }),
        );
    }
  };
  usePrompt(!silent && state.changed, history, message);
  useEffect(() => {
    updateState(id, state, {
      active: true,
    });

    return () =>
      updateState(id, state, {
        active: false,
      });
  }, [state.submitting]);
  return {
    changed: state.changed,
    formData: state.currentData,
    error: state.error,
    submit(e?: FormEvent) {
      e && e.preventDefault();

      if (!state.changed) {
        return false;
      }

      updateState(id, state, {
        changed: !!wait,
        submitting: true,
      });

      if (typeof onSubmit === 'function') {
        Promise.resolve(onSubmit(state.currentData))
          .then(() =>
            updateState(id, state, {
              initialData: state.currentData,
              changed: false,
              submitting: false,
            }),
          )
          .catch(error =>
            updateState(id, state, {
              error,
              changed: true,
              submitting: false,
            }),
          );
      }

      return false;
    },
    submitting: state.submitting,
    reset() {
      updateState(id, state, {
        currentData: state.initialData,
        changed: false,
        error: undefined,
      });
    },
    setFormData(updatedData) {
      updateData({ ...state.currentData, ...updatedData });
    },
    changeForm(e) {
      const { name, value } = e.target;
      updateData({ ...state.currentData, [name]: value });
    },
  };
}
