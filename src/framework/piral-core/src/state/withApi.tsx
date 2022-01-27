import * as React from 'react';
import { isfunc } from 'piral-base';
import { __RouterContext } from 'react-router';
import { ErrorBoundary, PortalRenderer } from '../components';
import { useGlobalStateContext } from '../hooks';
import { defaultRender, convertComponent, none } from '../utils';
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

// this is an arbitrary start number to have 6 digits
let portalIdBase = 123456;

const DefaultWrapper: React.FC = (props) => defaultRender(props.children);

interface CapturedProps {
  piral: PiletApi;
}

interface ForeignComponentContainerProps<T> {
  $portalId: string;
  $component: ForeignComponent<T>;
  $context: ComponentContext;
  innerProps: T & BaseComponentProps;
}

class ForeignComponentContainer<T> extends React.Component<ForeignComponentContainerProps<T>> {
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
      mount(node, innerProps, $context);
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
      update(current, innerProps, $context);
    }
  }

  componentWillUnmount() {
    const node = this.previous;
    const { $component } = this.props;
    const { unmount } = $component;

    if (node && isfunc(unmount)) {
      unmount(node);
      node.removeEventListener('render-html', this.handler, false);
    }

    this.previous = undefined;
  }

  render() {
    const { $portalId } = this.props;
    return <div data-portal-id={$portalId} ref={this.setNode} />;
  }
}

function wrapReactComponent<T>(
  Component: React.ComponentType<T & BaseComponentProps>,
  captured: CapturedProps,
  Wrapper: React.FC<T>,
): React.ComponentType<T> {
  return (props: T) => (
    <Wrapper {...props}>
      <Component {...props} {...captured} />
    </Wrapper>
  );
}

function wrapForeignComponent<T>(
  component: ForeignComponent<T & BaseComponentProps>,
  captured: CapturedProps,
  Wrapper: React.FC<T>,
) {
  return React.memo((props: T) => {
    const { state, readState, destroyPortal } = useGlobalStateContext();
    const router = React.useContext(__RouterContext);
    const id = React.useMemo(() => (portalIdBase++).toString(26), none);
    const context = React.useMemo(() => ({ router, state, readState }), [router, state]);
    const innerProps = React.useMemo(() => ({ ...props, ...captured }), [props]);

    React.useEffect(() => () => destroyPortal(id), none);

    return (
      <Wrapper {...props}>
        <PortalRenderer id={id} />
        <ForeignComponentContainer innerProps={innerProps} $portalId={id} $component={component} $context={context} />
      </Wrapper>
    );
  });
}

function isNotExotic(component: any): component is object {
  return !(component as React.ExoticComponent).$$typeof;
}

function wrapComponent<T>(
  converters: ComponentConverters<T & BaseComponentProps>,
  component: AnyComponent<T & BaseComponentProps>,
  captured: CapturedProps,
  Wrapper: React.FC<T>,
) {
  if (typeof component === 'object' && isNotExotic(component)) {
    const result = convertComponent(converters[component.type], component);
    return wrapForeignComponent<T>(result, captured, Wrapper);
  }

  return wrapReactComponent<T>(component, captured, Wrapper);
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
  captured = {},
) {
  const outerProps = { ...captured, piral };
  const converters = context.converters;
  const OuterWrapper = context.readState((m) => getWrapper(m.registry.wrappers, wrapperType));

  const Wrapper: React.FC<TProps> = (props) => (
    <OuterWrapper {...outerProps} {...props}>
      <ErrorBoundary {...outerProps} {...props} errorType={errorType}>
        {props.children}
      </ErrorBoundary>
    </OuterWrapper>
  );

  if (!component) {
    const pilet = piral.meta.name;
    console.error(`[${pilet}] The given value is not a valid component.`);
    // tslint:disable-next-line:no-null-keyword
    component = () => null;
  }

  return wrapComponent<TProps>(converters, component, outerProps, Wrapper);
}
