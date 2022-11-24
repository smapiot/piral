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

  private setNode = (node: HTMLDivElement) => {
    this.current = node;
  };

  componentDidMount() {
    const { current } = this;
    const { $component, $context, innerProps } = this.props;
    const { mount } = $component;

    if (current && isfunc(mount)) {
      mount(current, innerProps, $context, this.locals);
    }

    this.previous = current;
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
    const { previous } = this;
    const { $component } = this.props;
    const { unmount } = $component;

    if (previous && isfunc(unmount)) {
      unmount(previous, this.locals);
    }

    this.previous = undefined;
  }

  render() {
    const { $portalId } = this.props;
    return <piral-portal pid={$portalId} ref={this.setNode} />;
  }
}
