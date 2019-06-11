import * as React from 'react';
import { render } from 'react-dom';
import { ArbiterModuleMetadata } from 'react-arbiter';
import { Provider } from 'urql';
import { createInstance } from 'piral-core';
import { createFetchApi, createGqlApi, createLocaleApi, setupGqlClient, setupLocalizer, gqlQuery } from 'piral-ext';
import { getGateway, getContainer, getAvailablePilets } from './utils';
import {
  createDashboard,
  createErrorInfo,
  createMenu,
  createNotifications,
  createSearch,
  createModals,
} from './components';
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
          author
          dependencies
        }
      }
    `,
    ).then(({ pilets }) => pilets);
  };
  const {
    routes = {},
    trackers = [],
    selector = '#app',
    requestPilets = defaultRequestPilets,
    gatewayUrl: gateway,
    subscriptionUrl,
    translations = {},
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
    MenuContainer,
    MenuItem,
    NotificationItem,
    NotificationsContainer,
    ModalDialog,
    ModalsContainer,
    SearchContainer,
    SearchInput,
    SearchResult,
    Layout,
  } = options;
  const origin = getGateway(gateway);
  const client = setupGqlClient({
    url: origin,
    subscriptionUrl,
  });
  const localizer = setupLocalizer({
    messages: translations,
  });
  const Menu = createMenu({
    MenuContainer,
    MenuItem,
  });
  const Notifications = createNotifications({
    NotificationItem,
    NotificationsContainer,
  });
  const Search = createSearch({
    SearchContainer,
    SearchInput,
    SearchResult,
  });
  const Modals = createModals({
    ModalDialog,
    ModalsContainer,
  });

  const Piral = createInstance<PiExtApi>({
    availablePilets: getAvailablePilets(attach),
    requestPilets,
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
        ...createLocaleApi(localizer),
      };
    },
    languages: Object.keys(translations),
    routes,
    trackers,
  });

  const App: React.SFC = () => (
    <Provider value={client}>
      <Piral>
        {content => (
          <Layout Menu={Menu} Modals={Modals} Notifications={Notifications} Search={Search}>
            {content}
          </Layout>
        )}
      </Piral>
    </Provider>
  );

  render(<App />, getContainer(selector));
}
