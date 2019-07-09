import * as actions from './actions';
import { Atom } from '@dbeining/react-atom';
import { GlobalState, StateActions } from '../types';

function convert(ctx: Atom<GlobalState>, key: string) {
  const action: any = actions[key];
  return (...args) => action(ctx, ...args);
}

export function createActions(ctx: Atom<GlobalState>): StateActions {
  return Object.keys(actions).reduce(
    (prev, curr) => {
      prev[curr] = convert(ctx, curr);
      return prev;
    },
    {} as any,
  );
}
