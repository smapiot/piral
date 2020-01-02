import * as actions from '../actions';
import { Atom } from '@dbeining/react-atom';
import { PiralLoadingIndicator } from '../components';
import { renderInDom, convertComponent } from '../utils';
import {
  GlobalState,
  GlobalStateContext,
  EventEmitter,
  PiralDefineActions,
  ForeignComponent,
  ComponentContext,
} from '../types';

function createContext(state: Atom<GlobalState>, events: EventEmitter) {
  const ctx = {
    ...events,
    apis: {},
    converters: {
      html: ({ component }) => component,
      lazy: ({ load }) => {
        let present: [HTMLElement, any, ComponentContext] = undefined;
        let portalId: string = undefined;
        const promise = load.current || (load.current = load().then(c => convertComponent(ctx.converters[c.type], c)));
        const component: ForeignComponent<any> = {
          mount(...args) {
            portalId = renderInDom(ctx, args[0], PiralLoadingIndicator, {});
            present = args;
          },
          update(...args) {
            present = args;
          },
          unmount() {
            portalId = undefined;
            present = undefined;
          },
        };
        promise.then(({ mount, unmount, update }) => {
          portalId && ctx.destroyPortal(portalId);
          component.mount = mount;
          component.unmount = unmount;
          component.update = update;
          present && mount(...present);
        });
        return component;
      },
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
