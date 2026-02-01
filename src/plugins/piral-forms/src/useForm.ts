import { useState, useEffect, FormEvent } from 'react';
import { isfunc, useAction, useGlobalState, isSame, generateId, NavigationApi } from 'piral-core';
import { usePrompt } from './usePrompt';
import { FormProps, InputFormOptions, FormDataState } from './types';

const defaultMessage = 'Are you sure you want to discard the form data?';

interface StateUpdater {
  (id: string, state: FormDataState, patch: Partial<FormDataState>): void;
}

function createDefaultState<TFormData>(data: TFormData) {
  return {
    active: true,
    currentData: data,
    initialData: data,
    changed: false,
    submitting: false,
    error: undefined,
  };
}

function updateData<TFormData>(
  id: string,
  state: FormDataState,
  updateState: StateUpdater,
  newData: TFormData,
  options: InputFormOptions<TFormData, any>,
) {
  const { onChange } = options;
  updateState(id, state, {
    currentData: newData,
    changed: !isSame(newData, state.initialData),
    error: undefined,
  });

  if (isfunc(onChange)) {
    Promise.resolve(onChange(newData))
      .then((data) => {
        const updatedData = { ...newData, ...data };
        updateState(id, state, {
          currentData: updatedData,
          changed: !isSame(updatedData, state.initialData),
          error: undefined,
        });
      })
      .catch((error) =>
        updateState(id, state, {
          error,
        }),
      );
  }
}

function submitData<TFormData>(
  id: string,
  state: FormDataState,
  updateState: StateUpdater,
  options: InputFormOptions<TFormData, any>,
) {
  const { onSubmit, wait } = options;
  updateState(id, state, {
    changed: !!wait,
    submitting: true,
  });

  if (isfunc(onSubmit)) {
    Promise.resolve(onSubmit(state.currentData))
      .then(() =>
        updateState(id, state, {
          initialData: state.currentData,
          changed: false,
          submitting: false,
        }),
      )
      .catch((error) =>
        updateState(id, state, {
          error,
          changed: true,
          submitting: false,
        }),
      );
  }
}

function createProps<TFormData>(
  id: string,
  state: FormDataState,
  updateState: StateUpdater,
  options: InputFormOptions<TFormData, any>,
): FormProps<TFormData> {
  return {
    changed: state.changed,
    formData: state.currentData,
    error: state.error,
    submit(e?: FormEvent) {
      e && e.preventDefault();

      if (options.allowSubmitUnchanged || state.changed) {
        submitData(id, state, updateState, options);
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
      updateData(id, state, updateState, { ...state.currentData, ...updatedData }, options);
    },
    changeForm(e) {
      const { name, value } = e.target;
      updateData(id, state, updateState, { ...state.currentData, [name]: value }, options);
    },
  };
}

/**
 * Hook for using a form locally that blocks if a transition is performed.
 * @param initialData The initial data of the form.
 * @param navigation The navigation API.
 * @param options The options used for creating the form.
 * @param existingId The existing id of the form, if any.
 */
export function useForm<TFormData>(
  initialData: TFormData,
  navigation: NavigationApi,
  options: InputFormOptions<TFormData, any>,
  existingId?: string,
) {
  const { silent, message = defaultMessage } = options;
  const [id] = useState(existingId || generateId);
  const state = useGlobalState((m) => m.forms[id] || createDefaultState(initialData));
  const updateState = useAction('updateFormState');
  usePrompt(!silent && state.changed, navigation, message);
  useEffect(() => {
    updateState(id, state, {
      active: true,
    });

    return () =>
      updateState(id, state, {
        active: false,
      });
  }, [state.submitting]);
  return createProps(id, state, updateState, options);
}
