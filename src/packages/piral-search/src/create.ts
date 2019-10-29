import * as actions from './actions';
import { ReactChild } from 'react';
import { swap } from '@dbeining/react-atom';
import { isfunc } from 'react-arbiter';
import { buildName, Extend, Dict } from 'piral-core';
import { DefaultContainer, DefaultInput, DefaultResult } from './default';
import { PiletSearchApi, SearchSettings, SearchHandler, SearchProviderRegistration } from './types';

export interface InitialSearchProvider {
  /**
   * Defines the search handler.
   */
  search: SearchHandler;
  /**
   * The optional settings to be defined.
   */
  settings?: SearchSettings;
}

/**
 * Available configuration options for the search extension.
 */
export interface SearchConfig {
  /**
   * Sets the providers to be given by the app shell.
   * @default []
   */
  providers?: Array<InitialSearchProvider>;
  /**
   * Sets the initial results of the search.
   * @default []
   */
  results?: Array<ReactChild>;
  /**
   * Sets the initial query.
   * @default ''
   */
  query?: string;
}

function noop() {}

function createSearchRegistration(pilet: string, search: SearchHandler, settings: SearchSettings = {}): SearchProviderRegistration {
  const { onlyImmediate = false, onCancel = noop, onClear = noop } = settings;
  return {
    pilet,
    onlyImmediate,
    cancel: isfunc(onCancel) ? onCancel : noop,
    clear: isfunc(onClear) ? onClear : noop,
    search,
  };
}

function getSearchProviders(providers: Array<InitialSearchProvider>) {
  const searchProviders: Dict<SearchProviderRegistration> = {};
  let i = 0;

  for (const { search, settings } of providers) {
    searchProviders[`global-${i++}`] = createSearchRegistration(undefined, search, settings);
  }

  return searchProviders;
}

/**
 * Creates a new set of Piral API extensions for search and filtering.
 */
export function createSearchApi(config: SearchConfig = {}): Extend<PiletSearchApi> {
  const { providers = [], results = [], query = '' } = config;

  return context => {
    context.defineActions(actions);

    swap(context.state, state => ({
      ...state,
      components: {
        ...state.components,
        SearchContainer: DefaultContainer,
        SearchInput: DefaultInput,
        SearchResult: DefaultResult,
      },
      registry: {
        ...state.registry,
        searchProviders: getSearchProviders(providers),
      },
      search: {
        input: query,
        results: {
          loading: false,
          items: results,
        },
      },
    }));

    return (api, target) => {
      const pilet = target.name;
      let next = 0;

      return {
        registerSearchProvider(name, provider, settings?) {
          if (typeof name !== 'string') {
            settings = provider;
            provider = name;
            name = next++;
          }

          const id = buildName(pilet, name);
          context.registerSearchProvider(id, createSearchRegistration(pilet, q => provider(q, api), settings));
        },
        unregisterSearchProvider(name) {
          const id = buildName(pilet, name);
          context.unregisterSearchProvider(id);
        },
      };
    };
  };
}
