import { withExtension, withoutExtension, withoutPage, withPage } from '../utils';
import { PageRegistration, ExtensionRegistration, GlobalStateContext } from '../types';

export function registerPage(ctx: GlobalStateContext, name: string, value: PageRegistration) {
  ctx.dispatch(withPage(name, value));
}

export function unregisterPage(ctx: GlobalStateContext, name: string) {
  ctx.dispatch(withoutPage(name));
}

export function registerExtension(ctx: GlobalStateContext, name: string, value: ExtensionRegistration) {
  ctx.dispatch(withExtension(name, value));
}

export function unregisterExtension(ctx: GlobalStateContext, name: string, reference: any) {
  ctx.dispatch(withoutExtension(name, reference));
}
