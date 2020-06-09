import { render, ComponentType, createElement, Component } from 'preact';
import { BaseComponentProps } from 'piral-core';

// tslint:disable-next-line:no-null-keyword
export const anyPropType = () => null;

export function mountPreact<T extends BaseComponentProps>(
  el: HTMLElement,
  root: ComponentType<T>,
  props: T,
  ctx: any = {},
) {
  const contextTypes = {};

  ['piral', ...Object.keys(ctx)].forEach(key => {
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

  render(createElement(Provider, {}, createElement(root, props)), el);
}

export function unmountPreact(el: HTMLElement) {
  render('', el);
}
