import * as React from 'react';
import { render } from 'react-dom';
import { RouteComponentProps } from 'react-router-dom';
import { Provider } from 'urql';
import { createInstance, PiralCoreApi, LocalizationMessages } from 'piral-core';
import { createFetchApi, createGqlApi, setupGqlClient } from 'piral-ext';
import { getGateway, getContainer, getAvailableModules } from './options';
import { getTranslations, getLanguage } from './translations';
import { Loader, Dashboard, ErrorInfo } from './components';
import { PiExtApi, PiletApi } from './api';
import { Layout } from './layout';

export interface PiralOptions {
  selector?: string | Element;
  gateway?: string;
  language?: string;
  routes?: Record<string, React.ComponentType<RouteComponentProps>>;
  translations?: LocalizationMessages;
}

export function renderInstance(options: PiralOptions = {}) {
  const { routes = {}, selector, gateway, language, translations } = options;
  const origin = getGateway(gateway);
  const client = setupGqlClient({
    url: origin,
  });

  const Piral = createInstance({
    availableModules: getAvailableModules(),
    requestModules() {
      return fetch(`${origin}/api/v1/pilet`)
        .then(res => res.json())
        .then(res => res.items);
    },
    Loader,
    Dashboard,
    ErrorInfo,
    extendApi(api: PiralCoreApi<PiExtApi>): PiletApi {
      return {
        ...api,
        ...createFetchApi({
          base: origin,
        }),
        ...createGqlApi(client),
      };
    },
    language: getLanguage(language),
    translations: getTranslations(translations),
    routes,
  });

  const App: React.SFC = () => (
    <Provider value={client}>
      <Piral>{content => <Layout>{content}</Layout>}</Piral>
    </Provider>
  );

  render(<App />, getContainer(selector));
}
