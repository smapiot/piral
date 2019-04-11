import { Client, defaultExchanges, subscriptionExchange, createRequest, OperationResult } from 'urql';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { pipe, subscribe, Source } from 'wonka';
import { PiralGqlApi, GqlConfig } from './types';

function pipeToPromise<T>(source: Source<OperationResult<T>>) {
  return new Promise<T>((resolve, reject) => {
    pipe(
      source,
      subscribe(({ data, error }) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      }),
    );
  });
}

/**
 * Sets up an urql client by using the given config.
 * @param config The configuration for the new urql client.
 */
export function setupGqlClient(config: GqlConfig = {}) {
  const url = config.url || location.origin;
  const subscriptionUrl = (config.subscriptionUrl || url).replace(/^http/i, 'ws');
  const subscriptionClient = new SubscriptionClient(subscriptionUrl, {
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
  const forwardSubscription = operation => subscriptionClient.request(operation);
  return new Client({
    url,
    fetchOptions: config.default || {},
    exchanges: [
      ...defaultExchanges,
      subscriptionExchange({
        forwardSubscription,
      }),
    ],
  });
}

/**
 * Creates a new Piral GraphQL API extension.
 * @param client The urql client to use.
 */
export function createGqlApi(client: Client): PiralGqlApi {
  return {
    query(q, options = {}) {
      const { variables, cache } = options;
      const request = createRequest(q, variables);
      const response = client.executeQuery(request, { requestPolicy: cache });
      return pipeToPromise<any>(response);
    },
    mutate(q, options = {}) {
      const { variables } = options;
      const request = createRequest(q, variables);
      const response = client.executeMutation(request);
      return pipeToPromise<any>(response);
    },
    subscribe(q, subscriber, options = {}) {
      const { variables } = options;
      const request = createRequest(q, variables);
      const response = client.executeSubscription(request);
      const [teardown] = pipe(
        response,
        subscribe(({ data, error }) => {
          subscriber(data, error);
        }),
      );
      return teardown;
    },
  };
}
