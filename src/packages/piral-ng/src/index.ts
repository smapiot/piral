import { PiralCoreApi, TilePreferences, MenuSettings } from 'piral-core';
import { ngTile, ngPage, ngExtension, ngMenu, ngModal } from './register';

export interface PiralNgApi {
  /**
   * Registers a tile for an Angular component.
   * @param id The name of the tile element.
   * @param component The Angular component to bootstrap.
   * @param preferences The optional preferences to be supplied to the Dashboard for the tile.
   */
  registerTileNg(id: string, component: any, options?: TilePreferences);
  /**
   * Registers a route for an Angular component.
   * The route needs to be unique and can contain params.
   * Params are following the path-to-regexp notation, e.g., :id for an id parameter.
   * @param route The route to register.
   * @param component The Angular component to bootstrap.
   */
  registerPageNg(route: string, component: any);
  /**
   * Registers an extension component with an Angular component.
   * The slot name must refer to the extension slot.
   * @param id The global name of the extension slot.
   * @param component The Angular component to bootstrap.
   * @param defaults Optionally, sets the default values for the expected data.
   */
  registerExtensionNg<T>(id: string, component: any, defaults?: T);
  /**
   * Registers a menu item for an Angular component.
   * The name has to be unique within the current pilet.
   * @param id The name of the menu element.
   * @param component The Angular component to bootstrap.
   * @param settings The optional configuration for the menu item.
   */
  registerMenuNg(id: string, component: any, settings: MenuSettings);
  /**
   * Registers a modal dialog using an Angular component.
   * @param id The name of the modal element.
   * @param component The Angular component to bootstrap.
   * @param defaults Optionally, sets the default values for the inserted options.
   */
  registerModalNg<T>(id: string, component: any, defaults?: T);
}

/**
 * Creates a new set of Piral Angular API extensions.
 * @param api The API to extend.
 */
export function createNgApi<T>(api: PiralCoreApi<T>): PiralNgApi {
  return {
    registerTileNg(id, component, options) {
      ngTile(api, id, component, options);
    },
    registerPageNg(route, component) {
      ngPage(api, route, component);
    },
    registerExtensionNg(slot, component, defaults) {
      ngExtension(api, slot, component, defaults);
    },
    registerMenuNg(id, component, settings) {
      ngMenu(api, id, component, settings);
    },
    registerModalNg(id, component, defaults) {
      ngModal(api, id, component, defaults);
    },
  };
}
