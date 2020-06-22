import * as actions from '../actions';
import { Atom } from '@dbeining/react-atom';
import { EventEmitter, GlobalState, GlobalStateContext, PiralDefineActions } from '../types';

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

export function includeActions(ctx: GlobalStateContext, actions: PiralDefineActions) {
  const actionNames = Object.keys(actions);

  for (const actionName of actionNames) {
    const action = actions[actionName];
    ctx[actionName] = action.bind(ctx, ctx);
  }
}

export function createActions(state: Atom<GlobalState>, events: EventEmitter): GlobalStateContext {
  const context = createContext(state, events);
  includeActions(context, actions);
  return context;
}
