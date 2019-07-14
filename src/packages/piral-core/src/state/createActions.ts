import * as actions from './actions';
import { Atom } from '@dbeining/react-atom';
import { GlobalState, GlobalStateContext, EventEmitter } from '../types';

function convert(ctx: Atom<GlobalState>, events: EventEmitter, key: string) {
  const action: any = actions[key];
  return (...args) => action.call(events, ctx, ...args);
}

export function createActions(ctx: Atom<GlobalState>, events: EventEmitter) {
  return Object.keys(actions).reduce(
    (prev, curr) => {
      prev[curr] = convert(ctx, events, curr);
      return prev;
    },
    {
      state: ctx,
    } as GlobalStateContext,
  );
}
