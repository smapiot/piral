import 'piral-core';
import { Client } from 'urql';

declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends PiletGqlApi {}
}

export type UrqlClient = Client;

export interface GqlUnsubscriber {
  /**
   * Removes (i.e., unsubscribes from) the created subscription.
   */
  (): void;
}

export interface GqlSubscriber<T> {
  /**
   * Function to be called when new data is received.
   */
  (data: T, error?: Error): void;
}

export interface GqlQueryOptions {
  /**
   * The variables to be used in the query.
   */
  variables?: Record<string, any>;
  /**
   * Defines the cache mode of the query.
   */
  cache?: 'cache-first' | 'cache-only' | 'network-only' | 'cache-and-network';
}

export interface GqlMutationOptions {
  /**
   * The variables to be used in the query.
   */
  variables?: Record<string, any>;
}

export interface GqlSubscriptionOptions {
  /**
   * The variables to be used in the subscription.
   */
  variables?: Record<string, any>;
}

export interface PiletGqlApiQuery {
  <T = any>(query: string, options?: GqlQueryOptions): Promise<T>;
}

export interface PiletGqlApiMutate {
  <T = any>(mutation: string, options?: GqlMutationOptions): Promise<T>;
}

export interface PiletGqlApiSubscribe {
  <T = any>(subscription: string, subscriber: GqlSubscriber<T>, options?: GqlSubscriptionOptions): GqlUnsubscriber;
}

export interface PiletGqlApi {
  /**
   * Executes the given GraphQL query.
   * @param query The GraphQL query.
   * @param options Options for the query.
   */
  query: PiletGqlApiQuery;
  /**
   * Executes the given GraphQL mutation.
   * @param mutation The GraphQL mutation query.
   * @param options Options for the mutation.
   */
  mutate: PiletGqlApiMutate;
  /**
   * Establishes the given GraphQL subscription.
   * @param subscription The GraphQL subscription query.
   * @param subscriber The callback to use when data is received.
   * @param options Options for the subscription.
   */
  subscribe: PiletGqlApiSubscribe;
}
