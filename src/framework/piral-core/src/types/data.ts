/**
 * Defines the shape of the data store for storing shared data.
 */
export interface SharedData<TValue = any> {
  /**
   * Access a shared value by its name.
   */
  readonly [key: string]: TValue;
}

/**
 * Defines the potential targets when storing data.
 */
export type DataStoreTarget = 'memory' | 'local' | 'remote';

/**
 * Defines the custom options for storing data.
 */
export interface CustomDataStoreOptions {
  /**
   * The target data store. By default the data is only stored in memory.
   */
  target?: DataStoreTarget;
  /**
   * Optionally determines when the data expires.
   */
  expires?: 'never' | Date | number;
}

/**
 * Defines the options to be used for storing data.
 */
export type DataStoreOptions = DataStoreTarget | CustomDataStoreOptions;

/**
 * Defines the shape of a shared data item.
 */
export interface SharedDataItem<TValue = any> {
  /**
   * Gets the associated value.
   */
  value: TValue;
  /**
   * Gets the owner of the item.
   */
  owner: string;
  /**
   * Gets the storage location.
   */
  target: DataStoreTarget;
  /**
   * Gets the expiration of the item.
   */
  expires: number;
}
