import { PiralCoreApi, TilePreferences, MenuSettings } from 'piral-core';
import { ngTile, ngPage, ngExtension, ngMenu, ngModal } from './register';

export interface PiralNgApi {
  /**
   * Registers a tile for an Angular module.
   * @param id The id of the element to bootstrap into.
   * @param Module The Angular module to bootstrap.
   * @param preferences The optional preferences to be supplied to the Dashboard for the tile.
   */
  registerTileNg(id: string, Module: any, options?: TilePreferences);
  /**
   * Registers a route for an Angular module.
   * The route needs to be unique and can contain params.
   * Params are following the path-to-regexp notation, e.g., :id for an id parameter.
   * @param id The id of the element to bootstrap into.
   * @param Module The Angular module to bootstrap.
   * @param route The route to register.
   */
  registerPageNg(id: string, Module: any, route: string);
  /**
   * Registers an extension component with an Angular module.
   * The slot name must refer to the extension slot.
   * @param id The id of the element to bootstrap into.
   * @param Module The Angular module to bootstrap.
   * @param slot The global name of the extension slot.
   * @param defaults Optionally, sets the default values for the expected data.
   */
  registerExtensionNg<T>(id: string, Module: any, slot: string, defaults?: T);
  /**
   * Registers a menu item for an Angular module.
   * The name has to be unique within the current pilet.
   * @param id The id of the element to bootstrap into.
   * @param Module The Angular module to bootstrap.
   * @param settings The optional configuration for the menu item.
   */
  registerMenuNg(id: string, Module: any, settings: MenuSettings);
  /**
   * Registers a modal dialog using an Angular module.
   * @param id The id of the element to bootstrap into.
   * @param Module The Angular module to bootstrap.
   * @param defaults Optionally, sets the default values for the inserted options.
   */
  registerModalNg<T>(id: string, Module: any, defaults?: T);
}

/**
 * Creates a new set of Piral Angular API extensions.
 * @param api The API to extend.
 */
export function createNgApi<T>(api: PiralCoreApi<T>): PiralNgApi {
  return {
    registerTileNg(id, Module, options) {
      ngTile(api, id, Module, options);
    },
    registerPageNg(id, Module, route) {
      ngPage(api, id, Module, route);
    },
    registerExtensionNg(id, Module, slot, defaults) {
      ngExtension(api, id, Module, slot, defaults);
    },
    registerMenuNg(id, Module, settings) {
      ngMenu(api, id, Module, settings);
    },
    registerModalNg(id, Module, defaults) {
      ngModal(api, id, Module, defaults);
    },
  };
}
