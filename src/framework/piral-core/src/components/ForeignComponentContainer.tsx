import * as React from 'react';
import { isfunc } from 'piral-base';
import type {} from 'piral-debug-utils';
import type { ForeignComponent, BaseComponentProps, ComponentContext } from '../types';

interface ForeignComponentContainerProps<T> {
  $portalId: string;
  $component: ForeignComponent<T>;
  $context: ComponentContext;
  innerProps: T & BaseComponentProps;
}

export class ForeignComponentContainer<T> extends React.Component<ForeignComponentContainerProps<T>> {
  private locals?: Record<string, any> = {};
  private current?: HTMLElement;
  private previous?: HTMLElement;
  private handler = (ev: CustomEvent) => {
    const { innerProps } = this.props;
    ev.stopPropagation();
    innerProps.piral.renderHtmlExtension(ev.detail.target, ev.detail.props);
  };

  private setNode = (node: HTMLDivElement) => {
    this.current = node;
  };

  componentDidMount() {
    const node = this.current;
    const { $component, $context, innerProps } = this.props;
    const { mount } = $component;

    if (node && isfunc(mount)) {
      mount(node, innerProps, $context, this.locals);
      node.addEventListener('render-html', this.handler, false);
    }

    this.previous = node;
  }

  componentDidUpdate() {
    const { current, previous } = this;
    const { $component, $context, innerProps } = this.props;
    const { update } = $component;

    if (current !== previous) {
      previous && this.componentWillUnmount();
      current && this.componentDidMount();
    } else if (isfunc(update)) {
      update(current, innerProps, $context, this.locals);
    }
  }

  componentWillUnmount() {
    const node = this.previous;
    const { $component } = this.props;
    const { unmount } = $component;

    if (node && isfunc(unmount)) {
      unmount(node, this.locals);
      node.removeEventListener('render-html', this.handler, false);
    }

    this.previous = undefined;
  }

  render() {
    const { $portalId } = this.props;
    return <piral-portal pid={$portalId} ref={this.setNode} />;
  }
}
