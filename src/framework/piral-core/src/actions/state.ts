import { isSame } from '../utils';
import { GlobalState, GlobalStateContext } from '../types';

export function dispatch(ctx: GlobalStateContext, update: (state: GlobalState) => GlobalState) {
  const oldState = ctx.state.getState();
  const newState = update(oldState);

  if (!isSame(oldState, newState)) {
    ctx.state.setState(newState);
  }
}

export function readState<S>(ctx: GlobalStateContext, read: (state: GlobalState) => S) {
  return read(ctx.state.getState());
}
