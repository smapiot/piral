import { render, m, VNode } from 'million';
import type { BaseComponentProps } from 'piral-core';

export function mountMillion<T extends BaseComponentProps>(el: HTMLElement, root: (props: T) => VNode, props: T) {
  const node = m(root as any, props);
  render(el, node);
  return node;
}

export function updateMillion<T extends BaseComponentProps>(
  el: HTMLElement,
  root: (props: T) => VNode,
  props: T,
  oldNode: VNode,
) {
  const newNode = m(root as any, props);
  render(el, newNode, oldNode);
  return newNode;
}

export function unmountMillion(el: HTMLElement, oldNode: VNode) {
  render(el, '', oldNode);
}
