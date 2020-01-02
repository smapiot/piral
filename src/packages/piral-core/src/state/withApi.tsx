import * as React from 'react';
import { isfunc } from 'piral-base';
import { __RouterContext } from 'react-router';
import { StateContext } from './stateContext';
import { PiralError, PiralLoadingIndicator, ErrorBoundary, ErrorBoundaryOptions } from '../components';
import {  } from '../components/ErrorBoundary';
import { useGlobalState, useActions } from '../hooks';
import { defaultRender } from '../utils';
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

class ForeignComponentContainer<T> extends React.Component<ForeignComponentContainerProps<T>> {
  private current?: HTMLElement;
  private previous?: HTMLElement;

  componentDidMount() {
    const node = this.current;
    const { $component, $context, innerProps } = this.props;
    const { mount } = $component;

    if (node && isfunc(mount)) {
      mount(node, innerProps, $context);
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
      update(current, innerProps, $context);
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

function convertComponent<T extends { type: string }, U>(
  converter: (component: T) => ForeignComponent<U>,
  component: T,
): ForeignComponent<U> {
  if (typeof converter !== 'function') {
    throw new Error(`No converter for component of type "${component.type}" registered.`);
  }

  return converter(component);
}

function wrapComponent<T>(
  converters: ComponentConverters<T & BaseComponentProps>,
  component: AnyComponent<T & BaseComponentProps>,
  piral: PiletApi,
  stasisOptions: ErrorBoundaryOptions<T>,
) {
  if (!component) {
    console.error('The given value is not a valid component.');
    // tslint:disable-next-line:no-null-keyword
    component = () => null;
  }

  if (typeof component === 'object' && isNotExotic(component)) {
    const result = convertComponent(converters[component.type], component);
    return wrapForeignComponent<T>(result, stasisOptions, piral);
  }

  return wrapReactComponent<T>(component, stasisOptions, piral);
}

export function withApi<TProps>(
  converters: ComponentConverters<TProps & BaseComponentProps>,
  component: AnyComponent<TProps & BaseComponentProps>,
  piral: PiletApi,
  errorType: keyof Errors,
) {
  return wrapComponent<TProps>(converters, component, piral, {
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
