import { swap, Atom } from '@dbeining/react-atom';
import { withKey, withoutKey } from '../../utils';
import { GlobalState } from '../../types';

export function createForm(id: string) {
  swap(this as Atom<GlobalState>, state => ({
    ...state,
    forms: withKey(state.forms, id, {
      submitting: false,
      error: undefined,
      currentData: undefined,
      initialData: undefined,
      changed: false,
    }),
  }));
}

export function destroyForm(id: string) {
  swap(this as Atom<GlobalState>, state => ({
    ...state,
    forms: withoutKey(state.forms, id),
  }));
}

export function resetForm(id: string, data: any) {
  swap(this as Atom<GlobalState>, state => ({
    ...state,
    forms: withKey(state.forms, id, {
      submitting: false,
      error: undefined,
      currentData: data,
      initialData: data,
      changed: false,
    }),
  }));
}

export function changeForm(id: string, data: any, changed: boolean) {
  swap(this as Atom<GlobalState>, state => ({
    ...state,
    forms: withKey(state.forms, id, {
      ...state.forms[id],
      currentData: data,
      changed,
    }),
  }));
}
