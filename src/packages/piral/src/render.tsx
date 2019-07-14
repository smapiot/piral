import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'urql';
import { createInstance, setupState, EventEmitter, GlobalState } from 'piral-core';
import { createFetchApi, createGqlApi, createLocaleApi, setupGqlClient, setupLocalizer, gqlQuery } from 'piral-ext';
import { getGateway, getContainer, getAvailablePilets, getPiletRequester, getLoader } from './utils';
import { PiExtApi, PiletApi, PiralOptions, PiletQueryResult } from './types';

function defaultExtendApi(api: PiletApi) {
  return api;
}

function defaultLoader(): Promise<undefined> {
  return Promise.resolve(undefined);
}

const piletsQuery = `query initialData {
  pilets {
    hash
    link
    name
    version
  }
}`;

/**
 * Sets up a new Piral instance and renders it using the provided options.
 * Can be used as simple as calling the function directly without any
 * arguments.
 * @param options The options to use when setting up the Piral instance.
 * @example
```tsx
import { renderInstance } from 'piral';
import { layout } from './my-layout';
renderInstance({ layout });
export * from 'piral';
```
 */
export function renderInstance<TApi = PiExtApi, TState extends GlobalState = GlobalState>(
  options: PiralOptions<TApi, TState>,
): Promise<EventEmitter> {
  const { selector = '#app', gatewayUrl, subscriptionUrl, loader = defaultLoader, config = {}, layout } = options;
  const [AppLayout, initialState] = layout.build();
  const load = getLoader(loader, config);
  const base = getGateway(gatewayUrl);
  const client = setupGqlClient({
    url: base,
    subscriptionUrl,
  });
  const uri = { base };
  const renderLayout = (content: React.ReactNode) => <AppLayout>{content}</AppLayout>;
  const defaultRequestPilets = () => gqlQuery<PiletQueryResult>(client, piletsQuery).then(({ pilets }) => pilets);

  return load({
    fetch: (url, options) => createFetchApi(uri).fetch(url, options),
    query: (query, options) => gqlQuery(client, query, options),
  }).then(
    ({
      pilets = defaultRequestPilets,
      translations = {},
      attach,
      extendApi = defaultExtendApi,
      ...forwardOptions
    } = {}) => {
      const state = setupState({
        ...initialState,
        languages: Object.keys(translations),
      });
      const localizer = setupLocalizer({
        language: state.app.language.selected,
        messages: translations,
      });
      const Piral = createInstance({
        ...forwardOptions,
        availablePilets: getAvailablePilets(attach),
        requestPilets: getPiletRequester(pilets),
        extendApi(api, target) {
          const newApi: any = {
            ...createFetchApi(uri),
            ...createGqlApi(client),
            ...createLocaleApi(localizer),
            ...api,
          };
          return extendApi(newApi, target) as any;
        },
        state,
      });

      Piral.on('change-language', ev => {
        localizer.changeLanguage(ev.selected);
      });

      const App: React.FC = () => (
        <Provider value={client}>
          <Piral>{renderLayout}</Piral>
        </Provider>
      );
      render(<App />, getContainer(selector));
      return Piral;
    },
  );
}
