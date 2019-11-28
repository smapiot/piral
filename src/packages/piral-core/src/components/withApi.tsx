import * as React from 'react';
import { ArbiterStasis, isfunc, StasisOptions, WrapComponentOptions } from 'react-arbiter';
import { useGlobalState, useActions } from '../hooks';
import { PiralError, PiralLoadingIndicator } from './components';
import { defaultRender } from '../utils';
import { AnyComponent, Errors, ComponentConverters, ForeignComponent } from '../types';

let portalIdBase = 123456;

interface PortalRendererProps {
  id: string;
}

const PortalRenderer: React.FC<PortalRendererProps> = ({ id }) => {
  const children = useGlobalState(m => m.portals[id] || []);
  return defaultRender(children);
};

interface ForeignComponentContainerProps<T> {
  $portalId: string;
  $component: ForeignComponent<T>;
  innerProps: T;
}

function createForeignComponentContainer<T>(contextTypes = ['router']) {
  return class ForeignComponentContainer extends React.Component<ForeignComponentContainerProps<T>> {
    private current?: HTMLElement;
    private previous?: HTMLElement;
    static contextTypes = contextTypes.reduce((ct, key) => {
      // tslint:disable-next-line
      ct[key] = () => null;
      return ct;
    }, {});

    componentDidMount() {
      const node = this.current;
      const { $component, innerProps } = this.props;
      const { mount } = $component;

      if (node && isfunc(mount)) {
        mount(node, innerProps, this.context);
      }

      this.previous = node;
    }

    componentDidUpdate() {
      const { current, previous } = this;
      const { $component, innerProps } = this.props;
      const { update } = $component;

      if (current !== previous) {
        this.componentWillUnmount();
        this.componentDidMount();
      } else if (isfunc(update)) {
        update(current, innerProps, this.context);
      }
    }

    componentWillUnmount() {
      const node = this.previous;
      const { $component } = this.props;
      const { unmount } = $component;

      if (node && isfunc(unmount)) {
        unmount(node);
      }

      this.previous = undefined;
    }

    render() {
      const { $portalId } = this.props;

      return (
        <div
          data-portal-id={$portalId}
          ref={node => {
            this.current = node;
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
    <ArbiterStasis {...stasisOptions} renderProps={props}>
      <Component {...props} {...(componentOptions || ({} as any))} />
    </ArbiterStasis>
  );
}

function wrapForeignComponent<T, U>(
  component: ForeignComponent<T & U>,
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
      <ArbiterStasis {...stasisOptions} renderProps={props}>
        <PortalRenderer id={id} />
        <Component innerProps={{ ...props, ...componentOptions }} $portalId={id} $component={component} />
      </ArbiterStasis>
    );
  };
}

function isNotExotic(component: any): component is object {
  return !(component as React.ExoticComponent).$$typeof;
}

function wrapComponent<T, U>(
  converters: ComponentConverters<T & U>,
  Component: AnyComponent<T & U>,
  options: WrapComponentOptions<U> = {},
) {
  const { forwardProps, contextTypes = [], ...stasisOptions } = options;

  if (!Component) {
    console.error('The given value is not a valid component.');
    // tslint:disable-next-line:no-null-keyword
    Component = () => null;
  }

  if (typeof Component === 'object' && isNotExotic(Component)) {
    const converter = converters[Component.type];

    if (typeof converter !== 'function') {
      throw new Error(`No converter for component of type "${Component.type}" registered.`);
    }

    const result = converter(Component);
    return wrapForeignComponent<T, U>(result, stasisOptions, forwardProps, contextTypes);
  }

  return wrapReactComponent<T, U>(Component, stasisOptions, forwardProps);
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
  return wrapComponent<TProps, ApiForward<TApi>>(converters, Component, {
    forwardProps: { piral },
    onError(error) {
      console.error(piral, error);
    },
    renderChild(child) {
      return <React.Suspense fallback={<PiralLoadingIndicator />}>{child}</React.Suspense>;
    },
    renderError(error, props) {
      return <PiralError type={errorType} error={error} {...props} />;
    },
  });
}
