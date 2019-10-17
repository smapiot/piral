import * as React from 'react';
import { render } from 'react-dom';
import { createInstance, Piral, SetComponent, SetRoute } from 'piral-core';
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
  Dashboard,
} from 'piral-ext';
import { SwitchErrorInfo } from './components';
import { getContainer } from './utils';
import { PiralOptions } from './types';

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
  const { selector = '#app', extendApi = [], settings = {}, layout = {}, ...config } = options;
  const extenders = Array.isArray(extendApi) ? extendApi : [extendApi];
  const instance = createInstance({
    ...config,
    extendApi: [
      ...extenders,
      createFetchApi(settings.fetch),
      createGqlApi(setupGqlClient(settings.gql)),
      createLocaleApi(setupLocalizer(settings.locale)),
      createAuthApi(settings.auth),
      createDashboardApi(settings.dashboard),
      createMenuApi(settings.menu),
      createNotificationsApi(settings.notifications),
      createModalsApi(settings.modals),
      createContainerApi(settings.container),
      createFeedsApi(settings.feeds),
      createFormsApi(settings.forms),
      createSearchApi(settings.search),
    ],
  });

  const App: React.FC = () => (
    <Piral instance={instance}>
      <SetComponent name="LoadingIndicator" component={layout.LoadingIndicator} />
      <SetComponent name="DashboardContainer" component={layout.DashboardContainer} />
      <SetComponent name="DashboardTile" component={layout.DashboardTile} />
      <SetComponent name="ErrorInfo" component={layout.ErrorInfo || SwitchErrorInfo} />
      <SetComponent name="Layout" component={layout.Layout} />
      <SetComponent name="Router" component={layout.Router} />
      <SetComponent name="SearchContainer" component={layout.SearchContainer} />
      <SetComponent name="SearchInput" component={layout.SearchInput} />
      <SetComponent name="SearchResult" component={layout.SearchResult} />
      <SetComponent name="ModalsHost" component={layout.ModalsHost} />
      <SetComponent name="ModalsDialog" component={layout.ModalsDialog} />
      <SetRoute path="/" component={Dashboard} />
    </Piral>
  );
  render(<App />, getContainer(selector));
  return instance;
}
