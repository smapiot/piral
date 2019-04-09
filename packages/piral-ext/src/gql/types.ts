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
  (data: T): void;
}

export interface GqlQueryOptions {}

export interface GqlMutationOptions {}

export interface GqlMutationOptions {}

export interface GqlSubscriptionOptions {}

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
