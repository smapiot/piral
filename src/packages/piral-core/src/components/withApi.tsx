import * as React from 'react';
import {
  ArbiterStasis,
  isfunc,
  RenderCallback,
  ComponentDefinition,
  StasisOptions,
  WrapComponentOptions,
} from 'react-arbiter';
import { ComponentError, ComponentLoader } from './helpers';
import { convertComponent } from '../utils';
import { AnyComponent, Errors, ComponentConverters } from '../types';
import { useGlobalState, useActions } from '../hooks';

let portalIdBase = 123456;

interface PortalRendererProps {
  id: string;
}

const PortalRenderer: React.FC<PortalRendererProps> = ({ id }) => {
  const portals = useGlobalState(m => m.portals[id] || []);
  return <>{portals}</>;
};

function createForeignComponentContainer<T>(contextTypes = ['router']) {
  return class ForeignComponentContainer extends React.Component<Partial<T> & { $portalId: string }> {
    private container: HTMLElement | null;
    static contextTypes = contextTypes.reduce((ct, key) => {
      // tslint:disable-next-line
      ct[key] = () => null;
      return ct;
    }, {});

    componentDidMount() {
      const node = this.container;
      const ctx = this.context;

      if (node) {
        const { render, $portalId: _0, ...rest } = this.props as any;
        render(node, rest, ctx);
      }
    }

    render() {
      const { $portalId } = this.props;

      return (
        <div
          data-portal-id={$portalId}
          ref={node => {
            this.container = node;
          }}
        />
      );
    }
  };
}

function wrapReactComponent<T, U>(
  Component: React.ComponentType<T & U>,
  stasisOptions: StasisOptions,
  componentOptions: U | undefined,
): React.ComponentType<T> {
  return (props: T) => (
    <ArbiterStasis {...stasisOptions}>
      <Component {...props} {...(componentOptions || ({} as any))} />
    </ArbiterStasis>
  );
}

function wrapForeignComponent<T, U>(
  render: RenderCallback<T & U>,
  stasisOptions: StasisOptions,
  componentOptions: U | undefined,
  contextTypes?: Array<string>,
): React.ComponentType<T> {
  const Component = createForeignComponentContainer<T>(contextTypes);

  return (props: T) => {
    const { destroyPortal } = useActions();
    const [id] = React.useState(() => (portalIdBase++).toString(26));

    React.useEffect(() => {
      return () => destroyPortal(id);
    }, []);

    return (
      <ArbiterStasis {...stasisOptions}>
        <PortalRenderer id={id} />
        <Component {...props} {...(componentOptions || ({} as any))} $portalId={id} render={render} />
      </ArbiterStasis>
    );
  };
}

function wrapComponent<T, U>(value: ComponentDefinition<T & U>, options: WrapComponentOptions<U> = {}) {
  const { forwardProps, contextTypes = [], ...stasisOptions } = options;

  if (!value) {
    console.error('The given value is not a valid component.');
    value = () => {};
  }

  const argAsReact = value as React.ComponentType<T & U>;
  const argAsRender = value as RenderCallback<T & U>;
  const argRender = argAsReact.prototype && argAsReact.prototype.render;

  if (isfunc(argRender) || argAsReact.displayName) {
    return wrapReactComponent<T, U>(argAsReact, stasisOptions, forwardProps);
  }

  return wrapForeignComponent<T, U>(argAsRender, stasisOptions, forwardProps, contextTypes);
}

export interface ApiForward<TApi> {
  piral: TApi;
}

export function withApi<TApi, TProps>(
  converters: ComponentConverters<TProps & ApiForward<TApi>>,
  Component: AnyComponent<TProps & ApiForward<TApi>>,
  piral: TApi,
  errorType: keyof Errors,
) {
  const component = convertComponent(converters, Component, errorType);
  return wrapComponent<TProps, ApiForward<TApi>>(component, {
    forwardProps: { piral },
    onError(error) {
      console.error(piral, error);
    },
    renderChild(child) {
      return <React.Suspense fallback={<ComponentLoader />}>{child}</React.Suspense>;
    },
    renderError(error, props) {
      return <ComponentError type={errorType} error={error} {...props} />;
    },
  });
}
