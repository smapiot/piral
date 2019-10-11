import { Component } from './types';

const { h, app } = require('hyperapp');

export function mount<T extends Object>(
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

export function createElement(name: string, props: any) {
  return h(name, props, []);
}
