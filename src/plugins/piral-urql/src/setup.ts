import { Client, defaultExchanges, subscriptionExchange } from 'urql';
import { SubscriptionClient, OperationOptions } from 'subscriptions-transport-ws';
import { UrqlClient } from './types';

export interface GqlConfig {
  /**
   * Sets the default request init settings.
   */
  default?: RequestInit;
  /**
   * Sets the URL of the GraphQL endpoint.
   * @default location.origin
   */
  url?: string;
  /**
   * Sets the URL for the GraphQL subscription endpoint.
   */
  subscriptionUrl?: false | string;
  /**
   * Sets if the subscription should be lazy initialized.
   */
  lazy?: boolean;
  /**
   * Optional callback to the be used in case of a connection.
   */
  onConnected?(): void;
  /**
   * Optional callbsack to be used in case of a disconnect.
   * @param err The connection error.
   */
  onDisconnected?(err: Array<Error>): void;
}

/**
 * Sets up an urql client by using the given config.
 * @param config The configuration for the new urql client.
 */
export function setupGqlClient(config: GqlConfig = {}): UrqlClient {
  const url = config.url || location.origin;
  const subscriptionUrl = (config.subscriptionUrl || url).replace(/^http/i, 'ws');
  const subscriptionClient =
    config.subscriptionUrl !== false &&
    new SubscriptionClient(subscriptionUrl, {
      reconnect: true,
      lazy: config.lazy || false,
      inactivityTimeout: 0,
      connectionCallback(err) {
        const { onConnected, onDisconnected } = config;
        const errors = err && (Array.isArray(err) ? err : [err]);

        if (errors && errors.length > 0) {
          typeof onDisconnected === 'function' && onDisconnected(errors);
        } else {
          typeof onConnected === 'function' && onConnected();
        }
      },
    });
  const forwardSubscription = (operation: OperationOptions) => subscriptionClient.request(operation);
  const exchanges = [...defaultExchanges];

  if (subscriptionClient) {
    exchanges.push(
      subscriptionExchange({
        forwardSubscription,
      }),
    );
  }

  return new Client({
    url,
    fetchOptions: config.default || {},
    exchanges,
  });
}
