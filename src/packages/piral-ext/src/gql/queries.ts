import { OperationResult, createRequest, Client } from 'urql';
import { pipe, subscribe, Source } from 'wonka';
import { GqlQueryOptions, GqlMutationOptions, GqlSubscriber, GqlSubscriptionOptions } from './types';

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
 * Executes a new GraphQL query.
 * @param client The client to use as base.
 * @param q The GraphQL query to run.
 * @param options The options for the query.
 */
export function gqlQuery<TResult = any>(client: Client, q: string, options: GqlQueryOptions = {}) {
  const { variables, cache } = options;
  const request = createRequest(q, variables);
  const response = client.executeQuery(request, { requestPolicy: cache });
  return pipeToPromise<TResult>(response);
}

/**
 * Executes a new GraphQL mutation.
 * @param client The client to use as base.
 * @param q The GraphQL mutation to run.
 * @param options The options for the mutation.
 */
export function gqlMutation<TResult = any>(client: Client, q: string, options: GqlMutationOptions = {}) {
  const { variables } = options;
  const request = createRequest(q, variables);
  const response = client.executeMutation(request);
  return pipeToPromise<TResult>(response);
}

/**
 * Establishes a new GraphQL subscription.
 * @param client The client to use as base.
 * @param q The GraphQL subscription to establish.
 * @param subscriber The callback when new data has arrived.
 * @param options The options for the query.
 */
export function gqlSubscription<TResult = any>(
  client: Client,
  q: string,
  subscriber: GqlSubscriber<TResult>,
  options: GqlSubscriptionOptions = {},
) {
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
}
