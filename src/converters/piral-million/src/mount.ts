import type { BaseComponentProps, ComponentContext } from 'piral-core';
import { render, createElement, createContext } from 'million/react';

export const piralContext = createContext({});

export function mountMillion<T extends BaseComponentProps>(el: HTMLElement, root: any, props: T, ctx: ComponentContext) {
  const value = { ...ctx, piral: props.piral };
  const m = createElement as any;
  const node = m(piralContext.Provider, { value }, m(root, props));
  render(node, el);
  return node;
}

export function unmountMillion(el: HTMLElement) {
  render('', el);
}
