import * as React from 'react';
import { Provider } from 'urql';
import { render } from 'react-dom';
import { createInstance, setupState, EventEmitter } from 'piral-core';
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
renderInstance();
export * from 'piral';
```
 */
export function renderInstance(options: PiralOptions): Promise<EventEmitter> {
  const { selector = '#app', gatewayUrl, subscriptionUrl, loader = defaultLoader, layout } = options;
  const [AppLayout, config] = layout.build();
  const load = getLoader(loader);
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
        ...config,
        languages: Object.keys(translations),
      });
      const localizer = setupLocalizer({
        language: state.app.language.selected,
        messages: translations,
      });
      const Piral = createInstance<PiExtApi>({
        ...forwardOptions,
        availablePilets: getAvailablePilets(attach),
        requestPilets: getPiletRequester(pilets),
        extendApi(api, target) {
          return extendApi(
            {
              ...api,
              ...createFetchApi(uri),
              ...createGqlApi(client),
              ...createLocaleApi(localizer),
            },
            target,
          );
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
