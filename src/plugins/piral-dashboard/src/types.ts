import type { ComponentType, ReactNode } from 'react';
import type { RouteComponentProps } from 'react-router-dom';
import type {
  Dict,
  WrappedComponent,
  BaseComponentProps,
  AnyComponent,
  BaseRegistration,
  RegistrationDisposer,
} from 'piral-core';

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

  interface PiralCustomRegistryState {
    /**
     * The registered tile components for a dashboard.
     */
    tiles: Dict<TileRegistration>;
  }

  interface PiralCustomErrors {
    tile: TileErrorInfoProps;
  }

  interface PiralCustomComponentsState {
    /**
     * The dashboard container component.
     */
    DashboardContainer: ComponentType<DashboardContainerProps>;
    /**
     * The dashboard tile component.
     */
    DashboardTile: ComponentType<DashboardTileProps>;
  }
}

export interface InitialTile {
  /**
   * Defines the component to be used for the tile.
   */
  component: ComponentType<BareTileComponentProps>;
  /**
   * Optionally sets the preferences for the tile.
   */
  preferences?: TilePreferences;
}

export interface DashboardContainerProps extends RouteComponentProps {
  /**
   * The tiles to display.
   */
  children?: ReactNode;
}

export interface DashboardTileProps {
  /**
   * The currently used number of columns.
   */
  columns: number;
  /**
   * The currently used number of rows.
   */
  rows: number;
  /**
   * The resizable status.
   */
  resizable: boolean;
  /**
   * The provided tile preferences.
   */
  meta: TilePreferences;
  /**
   * The content of the tile to display.
   */
  children?: ReactNode;
}

export interface TileErrorInfoProps {
  /**
   * The type of the error.
   */
  type: 'tile';
  /**
   * The provided error details.
   */
  error: any;
  /**
   * The currently used number of columns.
   */
  columns: number;
  /**
   * The currently used number of rows.
   */
  rows: number;
  /**
   * The name of the pilet emitting the error.
   */
  pilet?: string;
}

export interface BareTileComponentProps {
  /**
   * The currently used number of columns.
   */
  columns: number;
  /**
   * The currently used number of rows.
   */
  rows: number;
}

export type TileComponentProps = BaseComponentProps & BareTileComponentProps;

export interface PiralCustomTilePreferences {}

export interface TilePreferences extends PiralCustomTilePreferences {
  /**
   * Sets the desired initial number of columns.
   * This may be overridden either by the user (if resizable true), or by the dashboard.
   */
  initialColumns?: number;
  /**
   * Sets the desired initial number of rows.
   * This may be overridden either by the user (if resizable true), or by the dashboard.
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

export interface TileRegistration extends BaseRegistration {
  component: WrappedComponent<TileComponentProps>;
  preferences: TilePreferences;
}

export interface PiletDashboardApi {
  /**
   * Registers a tile with a predefined tile components.
   * The name has to be unique within the current pilet.
   * @param name The name of the tile.
   * @param Component The component to be rendered within the Dashboard.
   * @param preferences The optional preferences to be supplied to the Dashboard for the tile.
   */
  registerTile(
    name: string,
    Component: AnyComponent<TileComponentProps>,
    preferences?: TilePreferences,
  ): RegistrationDisposer;
  /**
   * Registers a tile for predefined tile components.
   * @param Component The component to be rendered within the Dashboard.
   * @param preferences The optional preferences to be supplied to the Dashboard for the tile.
   */
  registerTile(Component: AnyComponent<TileComponentProps>, preferences?: TilePreferences): RegistrationDisposer;
  /**
   * Unregisters a tile known by the given name.
   * Only previously registered tiles can be unregistered.
   * @param name The name of the tile to unregister.
   */
  unregisterTile(name: string): void;
}
