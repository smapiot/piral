import type { ComponentType, FC } from 'react';
import type { Disposable, RemainingArgs } from 'piral-core';

declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends PiletFeedsApi {}

  interface PiralCustomState {
    /**
     * The relevant state for the registered feeds.
     */
    feeds: FeedsState;
  }

  interface PiralCustomActions {
    /**
     * Creates a new (empty) feed.
     * @param id The id of the feed.
     */
    createFeed(id: string): void;
    /**
     * Destroys an existing feed.
     * @param id The id of the feed.
     */
    destroyFeed(id: string): void;
    /**
     * Loads the feed via the provided details.
     * @param feed The feed details to use for loading.
     */
    loadFeed<TData, TItem>(feed: ConnectorDetails<TData, TItem>): void;
    /**
     * Updates an existing feed.
     * @param id The id of the feed.
     * @param item The item to pass on to the reducer.
     * @param reducer The reducer to use.
     */
    updateFeed<TData, TItem>(id: string, item: TItem, reducer: FeedReducer<TData, TItem>): void;
  }

  interface PiralCustomErrors {
    feed: FeedErrorInfoProps;
  }
}

/**
 * The error used when loading a feed resulted in an error.
 */
export interface FeedErrorInfoProps {
  /**
   * The type of the error.
   */
  type: 'feed';
  /**
   * The provided error details.
   */
  error: any;
  /**
   * The name of the pilet emitting the error.
   */
  pilet?: string;
}

export interface FeedDataState {
  /**
   * Determines if the feed data is currently loading.
   */
  loading: boolean;
  /**
   * Indicates if the feed data was already loaded and is active.
   */
  loaded: boolean;
  /**
   * Stores the potential error when initializing or loading the feed.
   */
  error: any;
  /**
   * The currently stored feed data.
   */
  data: any;
}

export interface FeedsState {
  /**
   * Gets the state of the available data feeds.
   */
  [id: string]: FeedDataState;
}

export interface PiletFeedsApi {
  /**
   * Creates a connector for wrapping components with data relations.
   * @param resolver The resolver for the initial data set.
   */
  createConnector<T>(resolver: FeedResolver<T>): FeedConnector<T>;
  /**
   * Creates a connector for wrapping components with data relations.
   * @param options The options for creating the connector.
   */
  createConnector<TData, TItem, TReducers extends FeedConnectorReducers<TData>>(
    options: FeedConnectorOptions<TData, TItem, TReducers>,
  ): FeedConnector<TData, TReducers>;
}

export interface FeedConnectorProps<TData> {
  /**
   * The current data from the feed.
   */
  data: TData;
}

export type GetActions<TReducers> = {
  [P in keyof TReducers]: (...args: RemainingArgs<TReducers[P]>) => void;
};

export type FeedConnector<TData, TReducers = {}> = GetActions<TReducers> & {
  /**
   * Connector function for wrapping a component.
   * @param component The component to connect by providing a data prop.
   */
  <TProps>(component: ComponentType<TProps & FeedConnectorProps<TData>>): FC<TProps>;
  /**
   * Invalidates the underlying feed connector.
   * Forces a reload on next use.
   */
  invalidate(): void;
};

export interface FeedResolver<TData> {
  /**
   * Function to derive the initial set of data.
   * @returns The promise for retrieving the initial data set.
   */
  (): Promise<TData>;
}

export interface FeedReducer<TData, TAction> {
  (data: TData, item: TAction): Promise<TData> | TData;
}

export interface FeedSubscriber<TItem> {
  (callback: (value: TItem) => void): Disposable;
}

export interface FeedConnectorReducers<TData> {
  [name: string]: (data: TData, ...args: any) => Promise<TData> | TData;
}

export interface FeedConnectorOptions<TData, TItem, TReducers extends FeedConnectorReducers<TData> = {}> {
  /**
   * Function to derive the initial set of data.
   * @returns The promise for retrieving the initial data set.
   */
  initialize: FeedResolver<TData>;
  /**
   * Function to be called for connecting to a live data feed.
   * @param callback The function to call when an item updated.
   * @returns A callback for disconnecting from the feed.
   */
  connect?: FeedSubscriber<TItem>;
  /**
   * Function to be called when some data updated.
   * @param data The current set of data.
   * @param item The updated item to include.
   * @returns The promise for retrieving the updated data set or the updated data set.
   */
  update?: FeedReducer<TData, TItem>;
  /**
   * Defines the optional reducers for modifying the data state.
   */
  reducers?: TReducers;
  /**
   * Optional flag to avoid lazy loading and initialize the data directly.
   */
  immediately?: boolean;
}

export interface ConnectorDetails<TData, TItem, TReducers extends FeedConnectorReducers<TData> = {}>
  extends FeedConnectorOptions<TData, TItem, TReducers> {
  /**
   * The ID of the connector.
   */
  id: string;
  /**
   * The dispose function if active.
   */
  dispose?(): void;
}
