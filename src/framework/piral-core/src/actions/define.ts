import { GlobalStateContext } from '../types';

export function defineAction(ctx: GlobalStateContext, actionName: string, action: any) {
  ctx[actionName] = action.bind(ctx, ctx);
}

export function defineActions(ctx: GlobalStateContext, actions: any) {
  for (const actionName of Object.keys(actions)) {
    const action = actions[actionName];
    defineAction(ctx, actionName, action);
  }
}
