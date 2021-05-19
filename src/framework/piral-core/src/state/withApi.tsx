import * as React from 'react';
import { isfunc } from 'piral-base';
import { __RouterContext } from 'react-router';
import { StateContext } from './stateContext';
import { PiralError, PiralLoadingIndicator, ErrorBoundary, ErrorBoundaryOptions } from '../components';
import { useGlobalState, useActions } from '../hooks';
import { defaultRender, convertComponent } from '../utils';
import {
  AnyComponent,
  Errors,
  ComponentConverters,
  ForeignComponent,
  PiletApi,
  BaseComponentProps,
  ComponentContext,
  GlobalStateContext,
} from '../types';

let portalIdBase = 123456;

interface PortalRendererProps {
  id: string;
}

const PortalRenderer: React.FC<PortalRendererProps> = ({ id }) => {
  const children = useGlobalState((m) => m.portals[id] || []);
  return defaultRender(children);
};

const DefaultWrapper: React.FC = (props) => <>{props.children}</>;

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
        ref={(node) => {
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
  Wrapper: React.ComponentType<any>,
): React.ComponentType<T> {
  return (props: T) => (
    <Wrapper {...props} piral={piral}>
      <ErrorBoundary {...stasisOptions} renderProps={props}>
        <Component {...props} piral={piral} />
      </ErrorBoundary>
    </Wrapper>
  );
}

function wrapForeignComponent<T>(
  component: ForeignComponent<T & BaseComponentProps>,
  stasisOptions: ErrorBoundaryOptions<T>,
  piral: PiletApi,
  Wrapper: React.ComponentType<any>,
): React.ComponentType<T> {
  return (props: T) => {
    const { destroyPortal } = useActions();
    const [id] = React.useState(() => (portalIdBase++).toString(26));
    const router = React.useContext(__RouterContext);
    const { state } = React.useContext(StateContext);
    const innerProps = { ...props, piral };

    React.useEffect(() => () => destroyPortal(id), []);

    return (
      <Wrapper {...innerProps}>
        <ErrorBoundary {...stasisOptions} renderProps={props}>
          <PortalRenderer id={id} />
          <ForeignComponentContainer
            innerProps={innerProps}
            $portalId={id}
            $component={component}
            $context={{ router, state }}
          />
        </ErrorBoundary>
      </Wrapper>
    );
  };
}

function isNotExotic(component: any): component is object {
  return !(component as React.ExoticComponent).$$typeof;
}

function wrapComponent<T>(
  converters: ComponentConverters<T & BaseComponentProps>,
  component: AnyComponent<T & BaseComponentProps>,
  piral: PiletApi,
  Wrapper: React.ComponentType<any>,
  stasisOptions: ErrorBoundaryOptions<T>,
) {
  if (!component) {
    console.error('The given value is not a valid component.');
    // tslint:disable-next-line:no-null-keyword
    component = () => null;
  }

  if (typeof component === 'object' && isNotExotic(component)) {
    const result = convertComponent(converters[component.type], component);
    return wrapForeignComponent<T>(result, stasisOptions, piral, Wrapper);
  }

  return wrapReactComponent<T>(component, stasisOptions, piral, Wrapper);
}

function getWrapper(wrappers: Record<string, React.ComponentType<any>>, wrapperType: string) {
  return wrappers[wrapperType] || wrappers['*'] || DefaultWrapper;
}

export function withApi<TProps>(
  context: GlobalStateContext,
  component: AnyComponent<TProps & BaseComponentProps>,
  piral: PiletApi,
  errorType: keyof Errors,
  wrapperType: string = errorType,
) {
  const converters = context.converters;
  const Wrapper = context.readState((m) => getWrapper(m.registry.wrappers, wrapperType));

  return wrapComponent<TProps>(converters, component, piral, Wrapper, {
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
