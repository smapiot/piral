export interface FetchConfig {
  /**
   * Sets the default request init settings.
   * @default {}
   */
  default?: RequestInit;
  /**
   * Sets the base URL to use for requests.
   * @default location.origin
   */
  base?: string;
}
