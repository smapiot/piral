import * as React from 'react';
import { isfunc } from 'piral-base';
import { __RouterContext } from 'react-router';
import { PiralError, PiralLoadingIndicator } from './components';
import { ErrorBoundary, ErrorBoundaryOptions } from './ErrorBoundary';
import { useGlobalState, useActions } from '../hooks';
import { defaultRender } from '../utils';
import { StateContext } from '../state/stateContext';
import {
  AnyComponent,
  Errors,
  ComponentConverters,
  ForeignComponent,
  PiletApi,
  BaseComponentProps,
  ComponentContext,
} from '../types';

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
  $context: ComponentContext;
  innerProps: T & BaseComponentProps;
}

interface ForeignComponentContainerState {
  loading: boolean;
  error: any;
}

class ForeignComponentContainer<T> extends React.Component<
  ForeignComponentContainerProps<T>,
  ForeignComponentContainerState
> {
  private current?: HTMLElement;
  private previous?: HTMLElement;
  private mounted = false;

  constructor(props: ForeignComponentContainerProps<T>) {
    super(props);
    const { load } = props.$component;
    let loading = false;

    if (isfunc(load)) {
      const result = load();

      if (result instanceof Promise) {
        loading = true;
        result.then(this.setLoaded, this.setError);
      }
    }

    this.state = {
      loading,
      error: undefined,
    };
  }

  private setLoaded = () => {
    if (this.mounted) {
      this.setState({
        loading: false,
      });
    }
  };

  private setError = (error: any) => {
    if (this.mounted) {
      this.setState({
        error,
      });
    }
  };

  componentDidMount() {
    const { loading } = this.state;

    if (!loading) {
      const node = this.current;
      const { $component, $context, innerProps } = this.props;
      const { mount } = $component;

      if (node && isfunc(mount)) {
        mount(node, innerProps, $context);
      }

      this.previous = node;
    }

    this.mounted = true;
  }

  componentDidUpdate() {
    const { loading } = this.state;

    if (!loading) {
      const { current, previous } = this;
      const { $component, $context, innerProps } = this.props;
      const { update } = $component;

      if (current !== previous) {
        previous && this.componentWillUnmount();
        current && this.componentDidMount();
      } else if (isfunc(update)) {
        update(current, innerProps, $context);
      }
    }
  }

  componentWillUnmount() {
    const { loading } = this.state;

    if (!loading) {
      const node = this.previous;
      const { $component } = this.props;
      const { unmount } = $component;

      if (node && isfunc(unmount)) {
        unmount(node);
      }
    }

    this.mounted = false;
    this.previous = undefined;
  }

  render() {
    const { $portalId } = this.props;
    const { error, loading } = this.state;

    if (error) {
      throw error;
    }

    return (
      <>
        <div
          data-portal-id={$portalId}
          ref={node => {
            this.current = node;
          }}
        />
        {loading && <PiralLoadingIndicator />}
      </>
    );
  }
}

function wrapReactComponent<T>(
  Component: React.ComponentType<T & BaseComponentProps>,
  stasisOptions: ErrorBoundaryOptions<T>,
  piral: PiletApi,
): React.ComponentType<T> {
  return (props: T) => (
    <ErrorBoundary {...stasisOptions} renderProps={props}>
      <Component {...props} piral={piral} />
    </ErrorBoundary>
  );
}

function wrapForeignComponent<T>(
  component: ForeignComponent<T & BaseComponentProps>,
  stasisOptions: ErrorBoundaryOptions<T>,
  piral: PiletApi,
): React.ComponentType<T> {
  return (props: T) => {
    const { destroyPortal } = useActions();
    const [id] = React.useState(() => (portalIdBase++).toString(26));
    const router = React.useContext(__RouterContext);
    const { state } = React.useContext(StateContext);

    React.useEffect(() => {
      return () => destroyPortal(id);
    }, []);

    return (
      <ErrorBoundary {...stasisOptions} renderProps={props}>
        <PortalRenderer id={id} />
        <ForeignComponentContainer
          innerProps={{ ...props, piral }}
          $portalId={id}
          $component={component}
          $context={{ router, state }}
        />
      </ErrorBoundary>
    );
  };
}

function isNotExotic(component: any): component is object {
  return !(component as React.ExoticComponent).$$typeof;
}

function wrapComponent<T>(
  converters: ComponentConverters<T & BaseComponentProps>,
  Component: AnyComponent<T & BaseComponentProps>,
  piral: PiletApi,
  stasisOptions: ErrorBoundaryOptions<T>,
) {
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
    return wrapForeignComponent<T>(result, stasisOptions, piral);
  }

  return wrapReactComponent<T>(Component, stasisOptions, piral);
}

export function withApi<TProps>(
  converters: ComponentConverters<TProps & BaseComponentProps>,
  Component: AnyComponent<TProps & BaseComponentProps>,
  piral: PiletApi,
  errorType: keyof Errors,
) {
  return wrapComponent<TProps>(converters, Component, piral, {
    onError(error) {
      console.error(piral, error);
    },
    renderChild(child) {
      return <React.Suspense fallback={<PiralLoadingIndicator />}>{child}</React.Suspense>;
    },
    renderError(error, props: any) {
      return <PiralError type={errorType} error={error} {...props} />;
    },
  });
}
