export interface TilePreferences {
  /**
   * Sets the desired initial number of columns.
   * This may be overriden either by the user (if resizable true), or by the dashboard.
   */
  initialColumns?: number;
  /**
   * Sets the desired initial number of rows.
   * This may be overriden either by the user (if resizable true), or by the dashboard.
   */
  initialRows?: number;
  /**
   * Determines if the tile can be resized by the user.
   * By default the size of the tile is fixed.
   */
  resizable?: boolean;
  /**
   * Declares a set of custom properties to be used with user-specified values.
   */
  customProperties?: Array<string>;
}
