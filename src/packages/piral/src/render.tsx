import * as React from 'react';
import { render } from 'react-dom';
import { ArbiterModuleMetadata } from 'react-arbiter';
import { Provider } from 'urql';
import { createInstance } from 'piral-core';
import { createFetchApi, createGqlApi, createLocaleApi, setupGqlClient, setupLocalizer, gqlQuery } from 'piral-ext';
import { getGateway, getContainer, getAvailablePilets } from './utils';
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
    return gqlQuery<PiletRequest>(
      client,
      `
      query initialData {
        pilets {
          hash
          link
          name
          version
        }
      }
    `,
    ).then(({ pilets }) => pilets);
  };
  const {
    selector = '#app',
    requestPilets = defaultRequestPilets,
    gatewayUrl: gateway,
    subscriptionUrl,
    translations = {},
    attach,
    initialize,
    layout,
    ...forwardOptions
  } = options;
  const origin = getGateway(gateway);
  const client = setupGqlClient({
    url: origin,
    subscriptionUrl,
  });
  const localizer = setupLocalizer({
    messages: translations,
  });

  const [AppLayout, config] = layout.build();
  const renderLayout = (content: React.ReactNode) => <AppLayout>{content}</AppLayout>;

  const Piral = createInstance<PiExtApi>({
    ...forwardOptions,
    ...config,
    availablePilets: getAvailablePilets(attach),
    requestPilets,
    extendApi(api): PiletApi {
      return {
        ...api,
        ...createFetchApi({
          base: origin,
        }),
        ...createGqlApi(client),
        ...createLocaleApi(localizer),
      };
    },
    languages: Object.keys(translations),
    setupState: initialize,
  });

  const App: React.SFC = () => (
    <Provider value={client}>
      <Piral>{renderLayout}</Piral>
    </Provider>
  );

  render(<App />, getContainer(selector));
}
