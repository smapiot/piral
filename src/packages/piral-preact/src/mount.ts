import { render, ComponentType, createElement } from 'preact';

export function mount<T extends Object>(el: HTMLElement, root: ComponentType<T>, props: T, ctx: any) {
  render(createElement(root, props), el);
}
