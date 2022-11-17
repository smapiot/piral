import * as actions from './actions';
import { ComponentType, createElement, PropsWithChildren } from 'react';
import { PiralPlugin, PageComponentProps, Dict, GlobalState, withApi, defaultRender, useGlobalState } from 'piral-core';
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

const DefaultWrapper: ComponentType<PropsWithChildren<PageComponentProps>> = (props) => defaultRender(props.children);

function createPageWrapper(Wrapper = DefaultWrapper, fallback = 'default'): ComponentType<PageComponentProps> {
  return (props) => {
    const layout = props.meta?.layout || fallback;
    const registration = useGlobalState((s) => s.registry.pageLayouts[layout] || s.registry.pageLayouts[fallback]);
    const Layout = registration?.component || DefaultWrapper;
    return createElement(Layout, props, createElement(Wrapper, props));
  };
}

function withPageLayouts(pageLayouts: Dict<PageLayoutRegistration>, fallback: string) {
  return (state: GlobalState): GlobalState => ({
    ...state,
    registry: {
      ...state.registry,
      wrappers: {
        ...state.registry.wrappers,
        page: createPageWrapper(state.registry.wrappers.page, fallback),
      },
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
