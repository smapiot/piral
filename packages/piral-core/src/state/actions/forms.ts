import { swap, Atom } from '@dbeining/react-atom';
import { updateKey, removeIndicator } from '../../utils';
import { GlobalState, FormDataState } from '../../types';

export function updateFormState(id: string, initial: FormDataState, patch: Partial<FormDataState>) {
  swap(this as Atom<GlobalState>, state => {
    const newState = {
      ...initial,
      ...(state.forms[id] || {}),
      ...patch,
    };
    const updatedState = newState.active || newState.submitting || newState.changed ? newState : removeIndicator;
    return {
      ...state,
      forms: updateKey(state.forms, id, updatedState),
    };
  });
}
