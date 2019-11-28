import * as actions from '../actions';
import { Atom } from '@dbeining/react-atom';
import { GlobalState, GlobalStateContext, EventEmitter } from '../types';

function convertAction(ctx: GlobalStateContext, key: string) {
  const action: any = actions[key];
  return (...args) => action.call(ctx, ctx.state, ...args);
}

export function createActions(state: Atom<GlobalState>, events: EventEmitter): GlobalStateContext {
  const ctx = {
    ...events,
    apis: {},
    converters: {
      html: ({ component }) => component,
    },
    state,
  } as GlobalStateContext;
  const actionNames = Object.keys(actions);

  for (const actionName of actionNames) {
    ctx[actionName] = convertAction(ctx, actionName);
  }

  return ctx;
}
