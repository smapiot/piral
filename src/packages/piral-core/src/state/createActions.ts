import * as actions from '../actions';
import { Atom } from '@dbeining/react-atom';
import { GlobalState, GlobalStateContext, EventEmitter, PiralDefineActions } from '../types';

function createContext(state: Atom<GlobalState>, events: EventEmitter) {
  const ctx = {
    ...events,
    apis: {},
    converters: {
      html: ({ component }) => component,
    },
    state,
  } as GlobalStateContext;
  return ctx;
}

function convertAction(ctx: GlobalStateContext, action: any) {
  return (...args) => action.call(ctx, ctx.state, ...args);
}

export function includeActions(ctx: GlobalStateContext, actions: PiralDefineActions) {
  const actionNames = Object.keys(actions);

  for (const actionName of actionNames) {
    ctx[actionName] = convertAction(ctx, actions[actionName]);
  }
}

export function createActions(state: Atom<GlobalState>, events: EventEmitter): GlobalStateContext {
  const context = createContext(state, events);
  includeActions(context, actions);
  return context;
}
