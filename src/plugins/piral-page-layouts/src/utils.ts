import { ComponentType, createElement, PropsWithChildren } from 'react';
import { useLocation } from 'react-router-dom';
import { PageComponentProps, Dict, defaultRender, useGlobalState, RouteSwitchProps, GlobalState } from 'piral-core';
import type { PageLayoutRegistration } from './types';

const DefaultLayout: React.FC<PropsWithChildren> = (props) => defaultRender(props.children);

function createPageWrapper(
  Routes: ComponentType<RouteSwitchProps>,
  fallback = 'default',
): ComponentType<RouteSwitchProps> {
  return (props) => {
    const location = useLocation();
    const data = props.paths.find((m) => m.matcher.test(location.pathname));
    const layout = data?.meta?.layout || fallback;
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
