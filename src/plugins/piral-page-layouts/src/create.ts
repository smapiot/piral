import * as actions from './actions';
import { ComponentType, createElement, PropsWithChildren } from 'react';
import { useLocation } from 'react-router-dom';
import { PiralPlugin, PageComponentProps, Dict, GlobalState, withApi, defaultRender, useGlobalState, RouteSwitchProps } from 'piral-core';
import type { PiletPageLayoutsApi, PageLayoutRegistration } from './types';

/**
 * Available configuration options for the page layout plugin.
 */
export interface PageLayoutsConfig {
  /**
   * Defines the name of the layout that should be used by default,
   * i.e., in case no layout was specified or found.
   */
  fallback?: string;
  /**
   * Defines the initially available layouts that can be used.
   */
  layouts?: Record<string, ComponentType<PageComponentProps>>;
}

function getPageLayouts(items: Record<string, ComponentType<PageComponentProps>>) {
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

const DefaultLayout: React.FC<PropsWithChildren> = props => defaultRender(props.children);

function createPageWrapper(Routes: ComponentType<RouteSwitchProps>, fallback = 'default'): ComponentType<RouteSwitchProps> {
  return (props) => {
    const location = useLocation();
    const data = props.paths.find(m => m.matcher.test(location.pathname));
    const layout = data?.meta?.layout || fallback;
    const registration = useGlobalState((s) => s.registry.pageLayouts[layout] || s.registry.pageLayouts[fallback]);
    const Layout = registration?.component || DefaultLayout;
    return createElement(Layout, props, createElement(Routes, props));
  };
}

function withPageLayouts(pageLayouts: Dict<PageLayoutRegistration>, fallback: string) {
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

/**
 * Creates new Pilet API extensions for dealing with page layouts.
 */
export function createPageLayoutsApi(config: PageLayoutsConfig = {}): PiralPlugin<PiletPageLayoutsApi> {
  const { layouts = {}, fallback } = config;

  return (context) => {
    const findPageLayout = (name: string) => context.readState((s) => s.registry.pageLayouts[name]);

    context.defineActions(actions);

    context.dispatch(withPageLayouts(getPageLayouts(layouts), fallback));

    return (api) => {
      const pilet = api.meta.name;
      return {
        registerPageLayout(name, pageLayout) {
          const current = findPageLayout(name);

          if (!current || current.pilet === pilet) {
            const component = withApi(context, pageLayout, api, 'pageLayout');
            context.registerPageLayout(name, {
              component,
              pilet,
            });
          }

          return () => api.unregisterPageLayout(name);
        },
        unregisterPageLayout(name) {
          const current = findPageLayout(name);

          if (current?.pilet === pilet) {
            context.unregisterPageLayout(name);
          }
        },
      };
    };
  };
}
