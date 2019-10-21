import { swap, Atom } from '@dbeining/react-atom';
import { GlobalState, updateKey, removeIndicator } from 'piral-core';
import { FormDataState } from './types';

function getNewFormState(newState: FormDataState, patch: Partial<FormDataState>) {
  if (patch.active === false && !newState.submitting) {
    return removeIndicator;
  }

  return newState.active || newState.submitting || newState.changed ? newState : removeIndicator;
}

export function updateFormState(
  ctx: Atom<GlobalState>,
  id: string,
  initial: FormDataState,
  patch: Partial<FormDataState>,
) {
  swap(ctx, state => {
    const newState = {
      ...initial,
      ...(state.forms[id] || {}),
      ...patch,
    };
    const updatedState = getNewFormState(newState, patch);
    return {
      ...state,
      forms: updateKey(state.forms, id, updatedState),
    };
  });
}
