import type { BaseComponentProps } from 'piral-core';
import { render } from 'react-dom-15';
import { createElement, ComponentType, Component } from 'react-15';

// tslint:disable-next-line:no-null-keyword
export const anyPropType = () => null;

export function mountReact15<T extends BaseComponentProps>(
  el: HTMLElement,
  root: ComponentType<T>,
  props: T,
  ctx: any = {},
) {
  const contextTypes = {};

  ['piral', ...Object.keys(ctx)].forEach((key) => {
    contextTypes[key] = anyPropType;
  });

  class Provider extends Component {
    static childContextTypes = contextTypes;

    getChildContext() {
      return {
        piral: props.piral,
        ...ctx,
      };
    }

    render() {
      return this.props.children;
    }
  }

  render(createElement(Provider, {}, createElement(root as any, props)), el);
}

export function unmountReact15(el: HTMLElement) {
  // tslint:disable-next-line:no-null-keyword
  render(null, el);
}
