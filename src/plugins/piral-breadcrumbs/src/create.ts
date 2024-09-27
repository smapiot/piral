import * as actions from './actions';
import { buildName, PiralPlugin, Dict, withRootExtension, withAll, GlobalState, createRouteMatcher } from 'piral-core';
import { DefaultBreadbrumbItem, DefaultBreadcrumbsContainer } from './default';
import { Breadcrumbs } from './Breadcrumbs';
import { PiletBreadcrumbsApi, BreadcrumbSettings, BreadcrumbRegistration } from './types';

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
    return createRouteMatcher(settings.matcher);
  } else {
    return createRouteMatcher(settings.path);
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

    const registerBcs = (bcs: Dict<BreadcrumbRegistration>) => {
      context.registerBreadcrumbs(bcs);
      return () => context.unregisterBreadcrumbs(Object.keys(bcs));
    };

    return (_, target) => {
      const pilet = target.name;
      let next = 0;

      const appendBc = (bcs: Dict<BreadcrumbRegistration>, name: string | number, settings: BreadcrumbSettings) => {
        const id = buildName(pilet, name);
        bcs[id] = {
          pilet,
          matcher: getMatcher(settings),
          settings,
        };
        return bcs;
      };

      return {
        registerBreadcrumbs(values) {
          const bcs: Dict<BreadcrumbRegistration> = {};

          for (const value of values) {
            const { name = next++, ...settings } = value;
            appendBc(bcs, name, settings);
          }

          return registerBcs(bcs);
        },
        registerBreadcrumb(name, settings?) {
          if (typeof name !== 'string') {
            settings = name;
            name = next++;
          }

          const bcs = appendBc({}, name, settings);
          return registerBcs(bcs);
        },
        unregisterBreadcrumb(name) {
          const id = buildName(pilet, name);
          context.unregisterBreadcrumbs([id]);
        },
      };
    };
  };
}
