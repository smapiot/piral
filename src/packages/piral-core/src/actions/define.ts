import { Atom } from '@dbeining/react-atom';
import { GlobalState, GlobalStateContext } from '../types';

export function defineAction(this: GlobalStateContext, ctx: Atom<GlobalState>, actionName: string, action: any) {
  this[actionName] = (...args) => action.call(this, ctx, ...args);
}

export function defineActions(this: GlobalStateContext, ctx: Atom<GlobalState>, actions: any) {
  for (const actionName of Object.keys(actions)) {
    const action = actions[actionName];
    defineAction.call(this, ctx, actionName, action);
  }
}
