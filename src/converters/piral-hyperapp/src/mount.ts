import type { Component } from './types';

const { h, app } = require('hyperapp');

export function mountHyperapp<T extends Object>(
  el: HTMLElement,
  root: Component<T>,
  props: T,
  ctx: any,
  state: any,
  actions: any,
) {
  app(
    {
      ...ctx,
      ...state,
    },
    actions,
    () => h(root, props),
    el,
  );
}

export function createHyperappElement(name: string, props: any) {
  return h(name, props, []);
}
