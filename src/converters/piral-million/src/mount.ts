import type { BaseComponentProps } from 'piral-core';
import { render, createElement } from 'million/react';

export function mountMillion<T extends BaseComponentProps>(el: HTMLElement, root: any, props: T) {
  const m = createElement as any;
  const node = m(root, props);
  render(node, el);
}

export function unmountMillion(el: HTMLElement) {
  render('', el);
}
