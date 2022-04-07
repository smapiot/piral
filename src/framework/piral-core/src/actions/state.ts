import { swap, deref } from '@dbeining/react-atom';
import { isSame } from '../utils';
import { GlobalState, GlobalStateContext } from '../types';

function onlyChangedState(oldState: GlobalState, newState: GlobalState) {
  return isSame(oldState, newState) ? oldState : newState;
}

export function dispatch(ctx: GlobalStateContext, update: (state: GlobalState) => GlobalState) {
  swap(ctx.state, oldState => onlyChangedState(oldState, update(oldState)));
}

export function readState<S>(ctx: GlobalStateContext, read: (state: GlobalState) => S) {
  const state = deref(ctx.state);
  return read(state);
}
