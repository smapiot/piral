import { ReactChild } from 'react';
import { Disposable, appendItems, prependItems, withKey, withoutKey, GlobalStateContext } from 'piral-core';
import { SearchOptions, SearchProviderRegistration, SearchActionsConfig } from './types';

function defaultFilter(_: string, providerNames: Array<string>) {
  return providerNames;
}

export function createActions(config: SearchActionsConfig = {}) {
  const { emptyTrigger = false, filter = defaultFilter } = config;
  return {
    setSearchInput(ctx: GlobalStateContext, input: string) {
      ctx.dispatch(state => ({
        ...state,
        search: {
          ...state.search,
          input,
        },
      }));
    },
    triggerSearch(ctx: GlobalStateContext, query?: string, immediate = false): Disposable {
      const providers = ctx.readState(state => state.registry.searchProviders);
      const { input, results } = ctx.readState(state => state.search);
      const { loading } = results;

      if (query === undefined) {
        query = input;
      }

      if (input !== query || !loading) {
        const selectedProviders = filter(query, Object.keys(providers));
        const providerKeys = selectedProviders.filter(m => !providers[m].onlyImmediate || immediate);
        const acceptQuery = emptyTrigger || !!query;
        const load = acceptQuery && providerKeys.length > 0;
        ctx.resetSearchResults(query, load);

        if (load) {
          let searchCount = providerKeys.length;
          let active = true;
          const opts: SearchOptions = {
            query,
            immediate,
          };

          providerKeys.forEach(key => {
            const provider = providers[key];
            provider.search(opts).then(
              results => {
                active && ctx.appendSearchResults(results, --searchCount === 0);
              },
              ex => {
                console.warn(ex);
                active && --searchCount === 0 && ctx.appendSearchResults([], true);
              },
            );
          });

          return () => {
            active = false;
            providerKeys.forEach(key => providers[key].cancel());
            ctx.appendSearchResults([], load);
          };
        } else if (!query) {
          selectedProviders.forEach(key => providers[key].clear());
        }
      }

      return () => {};
    },
    resetSearchResults(ctx: GlobalStateContext, input: string, loading: boolean) {
      ctx.dispatch(state => ({
        ...state,
        search: {
          input,
          results: {
            loading,
            items: [],
          },
        },
      }));
    },
    appendSearchResults(ctx: GlobalStateContext, items: Array<ReactChild>, done: boolean) {
      ctx.dispatch(state => ({
        ...state,
        search: {
          ...state.search,
          results: {
            loading: !done,
            items: appendItems(state.search.results.items, items),
          },
        },
      }));
    },
    prependSearchResults(ctx: GlobalStateContext, items: Array<ReactChild>, done: boolean) {
      ctx.dispatch(state => ({
        ...state,
        search: {
          ...state.search,
          results: {
            loading: !done,
            items: prependItems(state.search.results.items, items),
          },
        },
      }));
    },
    registerSearchProvider(ctx: GlobalStateContext, name: string, value: SearchProviderRegistration) {
      ctx.dispatch(state => ({
        ...state,
        registry: {
          ...state.registry,
          searchProviders: withKey(state.registry.searchProviders, name, value),
        },
      }));
    },
    unregisterSearchProvider(ctx: GlobalStateContext, name: string) {
      ctx.dispatch(state => ({
        ...state,
        registry: {
          ...state.registry,
          searchProviders: withoutKey(state.registry.searchProviders, name),
        },
      }));
    },
  };
}
