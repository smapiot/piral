import { swap, Atom } from '@dbeining/react-atom';
import { withKey } from '../../utils';
import { GlobalState } from '../../types';

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

export function submitForm(id: string, worker: Promise<any>) {
  const ctx = this as Atom<GlobalState>;
  swap(ctx, state => {
    const data = state.forms[id].currentData;
    Promise.resolve(worker)
      .then(() => {
        swap(ctx, state => ({
          ...state,
          forms: withKey(state.forms, id, {
            ...state.forms[id],
            submitting: false,
            error: undefined,
            initialData: data,
          }),
        }));
      })
      .catch(error => {
        swap(ctx, state => ({
          ...state,
          forms: withKey(state.forms, id, {
            ...state.forms[id],
            submitting: false,
            changed: true,
            error,
          }),
        }));
      });
    return {
      ...state,
      forms: withKey(state.forms, id, {
        ...state.forms[id],
        submitting: true,
        changed: false,
      }),
    };
  });
}
