import { ComponentType, createElement, PropsWithChildren, useEffect, useState } from 'react';
import {
  PageComponentProps,
  Dict,
  defaultRender,
  useGlobalState,
  RouteSwitchProps,
  GlobalState,
  useGlobalStateContext,
} from 'piral-core';
import type { PageLayoutRegistration } from './types';

const DefaultLayout: React.FC<PropsWithChildren> = (props) => defaultRender(props.children);

function createPageWrapper(
  Routes: ComponentType<RouteSwitchProps>,
  fallback = 'default',
): ComponentType<RouteSwitchProps> {
  return (props) => {
    const { navigation } = useGlobalStateContext();
    const [layout, setLayout] = useState(fallback);

    useEffect(() => {
      return navigation.listen(({ location }) => {
        const data = props.paths.find((m) => m.matcher.test(location.pathname));
        setLayout(data?.meta?.layout || fallback);
      });
    }, []);

    const registration = useGlobalState((s) => s.registry.pageLayouts[layout] || s.registry.pageLayouts[fallback]);
    const Layout = registration?.component || DefaultLayout;
    return createElement(Layout, props, createElement(Routes, props));
  };
}

export function getPageLayouts(items: Record<string, ComponentType<PageComponentProps>>) {
  const layouts: Dict<PageLayoutRegistration> = {};

  if (items && typeof items === 'object') {
    Object.keys(items).forEach((name) => {
      layouts[name] = {
        pilet: undefined,
        component: items[name],
      };
    });
  }

  return layouts;
}

export function withPageLayouts(pageLayouts: Dict<PageLayoutRegistration>, fallback: string) {
  return (state: GlobalState): GlobalState => ({
    ...state,
    components: {
      ...state.components,
      RouteSwitch: createPageWrapper(state.components.RouteSwitch, fallback),
    },
    registry: {
      ...state.registry,
      pageLayouts,
    },
  });
}
