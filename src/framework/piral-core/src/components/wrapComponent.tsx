import * as React from 'react';
import { __RouterContext } from 'react-router';
import { PortalRenderer } from './PortalRenderer';
import { ForeignComponentContainer } from './ForeignComponentContainer';
import { useGlobalStateContext } from '../hooks';
import { convertComponent, none } from '../utils';
import { AnyComponent, ComponentConverters, ForeignComponent, PiletApi, BaseComponentProps } from '../types';

// this is an arbitrary start number to have 6 digits
let portalIdBase = 123456;

interface CapturedProps {
  piral: PiletApi;
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

export function wrapComponent<T>(
  converters: ComponentConverters<T & BaseComponentProps>,
  component: AnyComponent<T & BaseComponentProps>,
  captured: CapturedProps,
  Wrapper: React.FC<T>,
) {
  if (!component) {
    const pilet = captured.piral.meta.name;
    console.error(`[${pilet}] The given value is not a valid component.`);
    // tslint:disable-next-line:no-null-keyword
    component = () => null;
  }

  if (typeof component === 'object' && isNotExotic(component)) {
    const result = convertComponent(converters[component.type], component);
    return wrapForeignComponent<T>(result, captured, Wrapper);
  }

  return wrapReactComponent<T>(component, captured, Wrapper);
}
