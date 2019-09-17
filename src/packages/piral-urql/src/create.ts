import { Client, defaultExchanges, subscriptionExchange } from 'urql';
import { SubscriptionClient, OperationOptions } from 'subscriptions-transport-ws';
import { gqlQuery, gqlMutation, gqlSubscription } from './queries';
import { PiletGqlApi, GqlConfig } from './types';

/**
 * Sets up an urql client by using the given config.
 * @param config The configuration for the new urql client.
 */
export function setupGqlClient(config: GqlConfig = {}) {
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

/**
 * Creates a new Piral GraphQL API extension.
 * @param client The urql client to use.
 */
export function createGqlApi(client: Client): PiletGqlApi {
  return {
    query(q, options) {
      return gqlQuery(client, q, options);
    },
    mutate(q, options) {
      return gqlMutation(client, q, options);
    },
    subscribe(q, subscriber, options) {
      return gqlSubscription(client, q, subscriber, options);
    },
  };
}
