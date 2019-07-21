export interface SharedData<TValue = any> {
  /**
   * Access a shared value by its name.
   */
  readonly [key: string]: TValue;
}

export type DataStoreTarget = 'memory' | 'local' | 'remote';

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

export type DataStoreOptions = DataStoreTarget | CustomDataStoreOptions;

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
