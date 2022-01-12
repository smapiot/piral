import * as actions from './actions';
import { buildName, PiralPlugin, Dict, withRootExtension, withAll, GlobalState } from 'piral-core';
import { DefaultBreadbrumbItem, DefaultBreadcrumbsContainer } from './default';
import { Breadcrumbs } from './Breadcrumbs';
import { PiletBreadcrumbsApi, BreadcrumbSettings, BreadcrumbRegistration } from './types';

// Unfortunately `require`d:
// * exports are otherwise potentially converted by, e.g., Parcel (see #385)
const ptr = require('path-to-regexp');

/**
 * Available configuration options for the breadcrumbs plugin.
 */
export interface DashboardConfig {
  /**
   * Sets the breadcrumbs to be given by the app shell.
   * @default []
   */
  breadcrumbs?: Array<BreadcrumbSettings>;
}

function getMatcher(settings: BreadcrumbSettings): RegExp {
  if (settings.matcher instanceof RegExp) {
    return settings.matcher;
  } else if (typeof settings.matcher === 'string') {
    return ptr(settings.matcher);
  } else {
    return ptr(settings.path);
  }
}

function getBreadcrumbs(items: Array<BreadcrumbSettings>) {
  const breadcrumbs: Dict<BreadcrumbRegistration> = {};
  let i = 0;

  for (const settings of items) {
    breadcrumbs[`global-${i++}`] = {
      pilet: undefined,
      matcher: getMatcher(settings),
      settings,
    };
  }

  return breadcrumbs;
}

function withBreadcrumbs(breadcrumbs: Dict<BreadcrumbRegistration>) {
  return (state: GlobalState): GlobalState => ({
    ...state,
    components: {
      BreadcrumbItem: DefaultBreadbrumbItem,
      BreadcrumbsContainer: DefaultBreadcrumbsContainer,
      ...state.components,
    },
    registry: {
      ...state.registry,
      breadcrumbs,
    },
  });
}

/**
 * Creates the Pilet API extension for activating breadcrumbs support.
 */
export function createBreadcrumbsApi(config: DashboardConfig = {}): PiralPlugin<PiletBreadcrumbsApi> {
  const { breadcrumbs = [] } = config;

  return (context) => {
    context.defineActions(actions);

    context.dispatch(
      withAll(withBreadcrumbs(getBreadcrumbs(breadcrumbs)), withRootExtension('piral-breadcrumbs', Breadcrumbs)),
    );

    return (api, target) => {
      const pilet = target.name;
      let next = 0;

      return {
        registerBreadcrumb(name, settings?) {
          if (typeof name !== 'string') {
            settings = name;
            name = next++;
          }

          const id = buildName(pilet, name);
          context.registerBreadcrumb(id, {
            pilet,
            matcher: getMatcher(settings),
            settings,
          });
          return () => api.unregisterBreadcrumb(name);
        },
        unregisterBreadcrumb(name) {
          const id = buildName(pilet, name);
          context.unregisterBreadcrumb(id);
        },
      };
    };
  };
}
