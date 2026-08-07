import type { BaseComponentProps } from 'piral-core';
import type { GeaComponentInstance } from './types';

export interface GeaLocals<T extends BaseComponentProps = BaseComponentProps> {
  instance?: GeaComponentInstance<T>;
}

export function mountGea<T extends BaseComponentProps>(
  el: HTMLElement,
  root: new () => GeaComponentInstance<T>,
  props: T,
  _ctx: any = {},
  locals: GeaLocals<T> = {},
) {
  if (!locals.instance) {
    locals.instance = new root();
    locals.instance.props = props;
    locals.instance.render(el);
  } else {
    locals.instance.props = props;
    locals.instance.flushSync();
  }
}

export function unmountGea<T extends BaseComponentProps>(locals: GeaLocals<T>) {
  locals.instance?.dispose();
  locals.instance = undefined;
}
