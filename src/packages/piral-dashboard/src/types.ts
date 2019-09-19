import { ComponentType } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Dict, WrappedComponent, ForeignComponent, BaseComponentProps } from 'piral-core';

declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends PiletDashboardApi {}

  interface PiralCustomState {}

  interface PiralCustomActions {
    /**
     * Registers a new tile.
     * @param name The name of the tile.
     * @param value The tile registration.
     */
    registerTile(name: string, value: TileRegistration): void;
    /**
     * Unregisters an existing tile.
     * @param name The name of the tile to be removed.
     */
    unregisterTile(name: string): void;
  }

  interface PiralCustomComponentsState {
    /**
     * The registered tile components for a dashboard.
     */
    tiles: Dict<TileRegistration>;
  }
}

export interface TileComponentProps extends BaseComponentProps {
  /**
   * The currently used number of columns.
   */
  columns: number;
  /**
   * The currently used number of rows.
   */
  rows: number;
}

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

export interface DashboardProps extends RouteComponentProps {}

export interface TileRegistration {
  component: WrappedComponent<TileComponentProps>;
  preferences: TilePreferences;
}

export interface PiletDashboardApi {
  /**
   * Registers a tile for general components.
   * The name has to be unique within the current pilet.
   * @param name The name of the tile.
   * @param render The function that is being called once rendering begins.
   * @param preferences The optional preferences to be supplied to the Dashboard for the tile.
   */
  registerTileX(name: string, render: ForeignComponent<TileComponentProps>, preferences?: TilePreferences): void;
  /**
   * Registers a tile for general components.
   * @param render The function that is being called once rendering begins.
   * @param preferences The optional preferences to be supplied to the Dashboard for the tile.
   */
  registerTileX(render: ForeignComponent<TileComponentProps>, preferences?: TilePreferences): void;
  /**
   * Registers a tile for React components.
   * The name has to be unique within the current pilet.
   * @param name The name of the tile.
   * @param Component The component to be rendered within the Dashboard.
   * @param preferences The optional preferences to be supplied to the Dashboard for the tile.
   */
  registerTile(name: string, Component: ComponentType<TileComponentProps>, preferences?: TilePreferences): void;
  /**
   * Registers a tile for React components.
   * @param Component The component to be rendered within the Dashboard.
   * @param preferences The optional preferences to be supplied to the Dashboard for the tile.
   */
  registerTile(Component: ComponentType<TileComponentProps>, preferences?: TilePreferences): void;
  /**
   * Unregisters a tile known by the given name.
   * Only previously registered tiles can be unregistered.
   * @param name The name of the tile to unregister.
   */
  unregisterTile(name: string): void;
}
