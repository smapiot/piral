import * as React from 'react';
import { render } from 'react-dom';
import { RouteComponentProps } from 'react-router-dom';
import { Provider } from 'urql';
import { createInstance, LocalizationMessages } from 'piral-core';
import { createFetchApi, createGqlApi, setupGqlClient } from 'piral-ext';
import { getGateway, getContainer, getAvailableModules } from './utils';
import { getLayout } from './layout';
import { getTranslations } from './translations';
import { Loader, Dashboard, ErrorInfo } from './components';
import { PiExtApi, PiletApi, PiralAttachment } from './api';

export interface PiralOptions {
  selector?: string | Element;
  gateway?: string;
  routes?: Record<string, React.ComponentType<RouteComponentProps>>;
  trackers?: Array<React.ComponentType<RouteComponentProps>>;
  translations?: LocalizationMessages;
  components?: Record<string, React.ComponentType<any>>;
  attach?: PiralAttachment;
}

export function renderInstance(options: PiralOptions = {}) {
  const { routes = {}, trackers = [], selector = '#app', gateway, translations, components, attach } = options;
  const origin = getGateway(gateway);
  const client = setupGqlClient({
    url: origin,
  });

  const Piral = createInstance<PiExtApi>({
    availableModules: getAvailableModules(attach),
    requestModules() {
      return fetch(`${origin}/api/v1/pilet`)
        .then(res => res.json())
        .then(res => res.items);
    },
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
