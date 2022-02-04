import * as React from 'react';
import { __RouterContext } from 'react-router';
import { ErrorBoundary, wrapComponent } from '../components';
import { defaultRender } from '../utils';
import { AnyComponent, Errors, PiletApi, BaseComponentProps, GlobalStateContext } from '../types';

const DefaultWrapper: React.FC = (props) => defaultRender(props.children);

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
  outerProps: any,
  wrapperType: string,
  errorType: keyof Errors,
): React.FC<TProps> {
  const OuterWrapper = context.readState((m) => getWrapper(m.registry.wrappers, wrapperType));

  return (props) => (
    <OuterWrapper {...outerProps} {...props}>
      <ErrorBoundary {...outerProps} {...props} errorType={errorType}>
        {props.children}
      </ErrorBoundary>
    </OuterWrapper>
  );
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
