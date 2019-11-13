import { render, ComponentType } from 'inferno';
import { createElement } from 'inferno-create-element';

export function mount<T extends Object>(el: HTMLElement, root: ComponentType<T>, props: T, ctx: any) {
  render(createElement(root as any, props), el);
}
