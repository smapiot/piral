import { swap, deref } from '@dbeining/react-atom';
import { GlobalState, GlobalStateContext } from '../types';

export function dispatch(ctx: GlobalStateContext, update: (state: GlobalState) => GlobalState) {
  swap(ctx.state, update);
}

export function readState<S>(ctx: GlobalStateContext, read: (state: GlobalState) => S) {
  const state = deref(ctx.state);
  return read(state);
}
