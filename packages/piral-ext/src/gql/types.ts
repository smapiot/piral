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
   * The variables to be used in the mutation.
   */
  variables?: Record<string, any>;
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
  subscriptionUrl?: string;
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

export interface PiralGqlApi {
  /**
   * Executes the given GraphQL query.
   * @param query The GraphQL query.
   * @param options Options for the query.
   */
  query<T = any>(query: string, options?: GqlQueryOptions): Promise<T>;
  /**
   * Executes the given GraphQL mutation.
   * @param mutation The GraphQL mutation query.
   * @param options Options for the mutation.
   */
  mutate<T = any>(mutation: string, options?: GqlMutationOptions): Promise<T>;
  /**
   * Establishes the given GraphQL subscription.
   * @param subscription The GraphQL subscription query.
   * @param subscriber The callback to use when data is received.
   * @param options Options for the subscription.
   */
  subscribe<T = any>(
    subscription: string,
    subscriber: GqlSubscriber<T>,
    options?: GqlSubscriptionOptions,
  ): GqlUnsubscriber;
}
