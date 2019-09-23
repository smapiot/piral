import * as React from 'react';
import { isfunc } from 'react-arbiter';
import { render } from 'react-dom';
import { Provider } from 'urql';
import { createInstance, setupState, EventEmitter } from 'piral-core';
import {
  createFetchApi,
  createGqlApi,
  createLocaleApi,
  createAuthApi,
  createDashboardApi,
  createMenuApi,
  createNotificationsApi,
  createModalsApi,
  createContainerApi,
  createFeedsApi,
  createFormsApi,
  createSearchApi,
  setupGqlClient,
  setupLocalizer,
  httpFetch,
  gqlQuery,
  gqlMutation,
  gqlSubscription,
} from 'piral-ext';
import { getGateway, getContainer, getAvailablePilets, getPiletRequester, getLoader } from './utils';
import { PiralOptions, PiletQueryResult } from './types';

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
export function renderInstance(options: PiralOptions): Promise<EventEmitter> {
  const {
    selector = '#app',
    gatewayUrl,
    subscriptionUrl,
    loader = defaultLoader,
    config = {},
    gql = {},
    layout,
  } = options;
  const [AppLayout, initialState] = layout.build();
  const load = getLoader(loader, config);
  const base = getGateway(gatewayUrl);
  const client = setupGqlClient({
    url: base,
    subscriptionUrl,
    ...gql,
  });
  const uri = {
    base,
    ...config.fetch,
  };
  const renderLayout = (content: React.ReactNode) => <AppLayout>{content}</AppLayout>;
  const defaultRequestPilets = () => gqlQuery<PiletQueryResult>(client, piletsQuery).then(({ pilets }) => pilets);

  return load({
    fetch: (url, options) => httpFetch(uri, url, options),
    query: (query, options) => gqlQuery(client, query, options),
    mutate: (mutation, options) => gqlMutation(client, mutation, options),
    subscribe: (subscription, subscriber, options) => gqlSubscription(client, subscription, subscriber, options),
  }).then(
    ({
      pilets = defaultRequestPilets,
      translations = {},
      extendApi = [],
      attach,
      fetch: fetchOptions = uri,
      locale: localeOptions = config.locale,
      state: explicitState,
      ...forwardOptions
    } = {}) => {
      const messages = Array.isArray(translations)
        ? translations.reduce((prev, curr) => {
            prev[curr] = {};
            return prev;
          }, {})
        : translations;
      const state = setupState(
        {
          ...initialState,
        },
        explicitState,
      );
      const localizer = setupLocalizer({
        messages,
        ...localeOptions,
      });
      const createApiExtenders = Array.isArray(extendApi) ? extendApi : [extendApi];
      const Piral = createInstance({
        ...forwardOptions,
        availablePilets: getAvailablePilets(),
        requestPilets: getPiletRequester(pilets),
        extendApi: [
          ...createApiExtenders,
          createFetchApi(fetchOptions),
          createGqlApi(client),
          createLocaleApi(localizer),
          createAuthApi(),
          createDashboardApi(),
          createMenuApi(),
          createNotificationsApi(),
          createModalsApi(),
          createContainerApi(),
          createFeedsApi(),
          createFormsApi(),
          createSearchApi(),
        ],
        state,
      });

      if (isfunc(attach)) {
        attach(Piral.root);
      }

      const App: React.FC = () => (
        <Provider value={client}>
          <Piral.App>{renderLayout}</Piral.App>
        </Provider>
      );

      render(<App />, getContainer(selector));
      return Piral;
    },
  );
}
