import * as React from 'react';
import { render } from 'react-dom';
import { RouteComponentProps } from 'react-router-dom';
import { Provider, createRequest } from 'urql';
import { createInstance, LocalizationMessages, PiletRequester } from 'piral-core';
import { createFetchApi, createGqlApi, setupGqlClient, pipeToPromise } from 'piral-ext';
import { getGateway, getContainer, getAvailablePilets } from './utils';
import { getLayout } from './layout';
import { getTranslations } from './translations';
import { Loader, Dashboard, ErrorInfo } from './components';
import { PiExtApi, PiletApi, PiralAttachment } from './api';
import { ArbiterModuleMetadata } from 'react-arbiter';

interface PiletRequest {
  pilets: Array<ArbiterModuleMetadata>;
}

export interface PiralOptions {
  /**
   * Sets the selector of the element to render into.
   * @default '#app'
   */
  selector?: string | Element;
  /**
   * Sets the function to request the pilets. By default the
   * pilets are requested via the standardized GraphQL resource.
   */
  requestPilets?: PiletRequester;
  /**
   * Sets the URL of the portal gateway to the backend.
   * @default document.location.origin,
   */
  gatewayUrl?: string;
  /**
   * Sets the URL of the GraphQL subscription or prevents
   * creating a subscription.
   * @default gatewayUrl,
   */
  subscriptionUrl?: false | string;
  /**
   * Sets additional routes (pages) to be available.
   * @default {}
   */
  routes?: Record<string, React.ComponentType<RouteComponentProps>>;
  /**
   * Sets additional trackers to be available.
   * @default []
   */
  trackers?: Array<React.ComponentType<RouteComponentProps>>;
  /**
   * Sets the default translations to be available.
   * @default {}
   */
  translations?: LocalizationMessages;
  /**
   * Overrides the defaults and sets some custom components.
   * @default {}
   */
  components?: Record<string, React.ComponentType<any>>;
  /**
   * Attaches a single static module to the application.
   */
  attach?: PiralAttachment;
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
export function renderInstance(options: PiralOptions = {}) {
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
    Dashboard,
    ErrorInfo,
    extendApi(api): PiletApi {
      return {
        ...api,
        ...createFetchApi({
          base: origin,
        }),
        ...createGqlApi(client),
      };
    },
    translations: getTranslations(translations),
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
