import * as actions from './actions';
import { ComponentType } from 'react';
import { PiralPlugin, PageComponentProps, withApi } from 'piral-core';
import { getPageLayouts, withPageLayouts } from './utils';
import type { PiletPageLayoutsApi } from './types';

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
