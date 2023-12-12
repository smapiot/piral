import * as React from 'react';
import { ErrorBoundary, wrapComponent } from '../components';
import { defaultRender } from '../utils';
import { AnyComponent, Errors, PiletApi, BaseComponentProps, GlobalStateContext } from '../types';

const DefaultWrapper: React.FC<React.PropsWithChildren<{}>> = (props) => defaultRender(props.children);

function getWrapper(wrappers: Record<string, React.ComponentType<any>>, wrapperType: string) {
  const WrapAll = wrappers['*'];
  const WrapType = wrappers[wrapperType];

  if (WrapAll && WrapType) {
    return (props) => (
      <WrapAll {...props}>
        <WrapType {...props} />
      </WrapAll>
    );
  }

  return WrapType || WrapAll || DefaultWrapper;
}

function makeWrapper<TProps>(
  context: GlobalStateContext,
  outerProps: BaseComponentProps,
  wrapperType: string,
  errorType: keyof Errors,
): React.FC<React.PropsWithChildren<TProps>> {
  const wrapped = context.readState((m) => m.app.wrap);
  const OuterWrapper = context.readState((m) => getWrapper(m.registry.wrappers, wrapperType));
  const Wrapper = (props) => (
    <OuterWrapper {...outerProps} {...props}>
      <ErrorBoundary {...outerProps} {...props} errorType={errorType}>
        {props.children}
      </ErrorBoundary>
    </OuterWrapper>
  );

  return wrapped
    ? (props) => (
        <piral-component origin={outerProps.piral.meta.name}>
          <Wrapper {...props} />
        </piral-component>
      )
    : Wrapper;
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
  const Wrapper = makeWrapper<TProps>(context, outerProps, wrapperType, errorType);
  return wrapComponent(converters, component, outerProps, Wrapper);
}
