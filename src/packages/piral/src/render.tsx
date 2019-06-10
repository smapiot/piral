import * as React from 'react';
import { render } from 'react-dom';
import { ArbiterModuleMetadata } from 'react-arbiter';
import { Provider, createRequest } from 'urql';
import { createInstance } from 'piral-core';
import { createFetchApi, createGqlApi, setupGqlClient, pipeToPromise } from 'piral-ext';
import { getGateway, getContainer, getAvailablePilets } from './utils';
import { getLayout } from './layout';
import { createDashboard, createErrorInfo } from './components';
import { PiExtApi, PiletApi, PiralOptions } from './types';

interface PiletRequest {
  pilets: Array<ArbiterModuleMetadata>;
}

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
export function renderInstance(options: PiralOptions) {
  const defaultRequestPilets = () => {
    const source = client.executeQuery(
      createRequest(`
      query initialData {
        pilets {
          hash
          link
          name
          version
          author
          dependencies
        }
      }
    `),
    );
    return pipeToPromise<PiletRequest>(source).then(({ pilets }) => pilets);
  };
  const {
    routes = {},
    trackers = [],
    selector = '#app',
    requestPilets = defaultRequestPilets,
    gatewayUrl: gateway,
    subscriptionUrl,
    translations,
    components,
    attach,
    Loader,
    DashboardContainer,
    Tile,
    UnknownErrorInfo,
    PageErrorInfo = UnknownErrorInfo,
    NotFoundErrorInfo = UnknownErrorInfo,
    FeedErrorInfo = UnknownErrorInfo,
    FormErrorInfo = UnknownErrorInfo,
    LoadingErrorInfo = UnknownErrorInfo,
  } = options;
  const origin = getGateway(gateway);
  const client = setupGqlClient({
    url: origin,
    subscriptionUrl,
  });

  const Piral = createInstance<PiExtApi>({
    availablePilets: getAvailablePilets(attach),
    requestPilets,
    components,
    Loader,
    Dashboard: createDashboard({
      DashboardContainer,
      Tile,
    }),
    ErrorInfo: createErrorInfo({
      FeedErrorInfo,
      FormErrorInfo,
      LoadingErrorInfo,
      NotFoundErrorInfo,
      PageErrorInfo,
      UnknownErrorInfo,
    }),
    extendApi(api): PiletApi {
      return {
        ...api,
        ...createFetchApi({
          base: origin,
        }),
        ...createGqlApi(client),
      };
    },
    translations,
    routes,
    trackers,
  });

  const Layout = getLayout();
  const App: React.SFC = () => (
    <Provider value={client}>
      <Piral>{content => <Layout>{content}</Layout>}</Piral>
    </Provider>
  );

  render(<App />, getContainer(selector));
}
