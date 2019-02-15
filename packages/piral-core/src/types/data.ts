export interface SharedData {
  /**
   * Access a shared value by its name.
   */
  readonly [key: string]: any;
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

export interface SharedDataItem {
  /**
   * Gets the associated value.
   */
  value: any;
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
