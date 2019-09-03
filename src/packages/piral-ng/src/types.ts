import { TilePreferences, MenuSettings } from 'piral-core';

declare module 'piral-core/lib/types/api' {
  interface PiletCustomApi extends PiralNgApi {}
}

/**
 * Defines the provided set of Angular Pilet API extensions.
 */
export interface PiralNgApi {
  /**
   * Registers a tile for an Angular component.
   * The id parameter has to be unique within the current pilet.
   * @param id The name of the tile element.
   * @param component The Angular component to bootstrap.
   * @param preferences The optional preferences to be supplied to the Dashboard for the tile.
   */
  registerTileNg(id: string, component: any, options?: TilePreferences): void;
  /**
   * Registers a tile for an Angular component.
   * @param component The Angular component to bootstrap.
   * @param preferences The optional preferences to be supplied to the Dashboard for the tile.
   */
  registerTileNg(component: any, options?: TilePreferences): void;
  /**
   * Registers a route for an Angular component.
   * The route needs to be unique and can contain params.
   * Params are following the path-to-regexp notation, e.g., :id for an id parameter.
   * @param route The route to register.
   * @param component The Angular component to bootstrap.
   */
  registerPageNg(route: string, component: any): void;
  /**
   * Registers an extension component with an Angular component.
   * The slot name must refer to the extension slot.
   * @param id The global name of the extension slot.
   * @param component The Angular component to bootstrap.
   * @param defaults Optionally, sets the default values for the expected data.
   */
  registerExtensionNg<T>(id: string, component: any, defaults?: T): void;
  /**
   * Registers a menu item for an Angular component.
   * The id parameter has to be unique within the current pilet.
   * @param id The name of the menu element.
   * @param component The Angular component to bootstrap.
   * @param settings The optional configuration for the menu item.
   */
  registerMenuNg(id: string, component: any, settings: MenuSettings): void;
  /**
   * Registers a menu item for an Angular component.
   * @param component The Angular component to bootstrap.
   * @param settings The optional configuration for the menu item.
   */
  registerMenuNg(component: any, settings: MenuSettings): void;
  /**
   * Registers a modal dialog using an Angular component.
   * @param id The name of the modal element.
   * @param component The Angular component to bootstrap.
   * @param defaults Optionally, sets the default values for the inserted options.
   */
  registerModalNg<T>(id: string, component: any, defaults?: T): void;
}
