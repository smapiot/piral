import { FunctionalComponentOptions } from 'vue';
import {
  TilePreferences,
  MenuSettings,
  TileComponentProps,
  ModalComponentProps,
  MenuComponentProps,
  ExtensionComponentProps,
  PageComponentProps,
  PiletApi,
} from 'piral-core';

declare module 'piral-core/lib/types/api' {
  interface PiletCustomApi extends PiralVueApi {}
}

/**
 * Defines the provided set of Vue Pilet API extensions.
 */
export interface PiralVueApi {
  /**
   * Registers a tile for a Vue component.
   * The id parameter has to be unique within the current pilet.
   * @param id The name of the tile.
   * @param component The Vue component.
   * @param preferences The optional preferences to be supplied to the Dashboard for the tile.
   */
  registerTileVue(
    id: string,
    component: FunctionalComponentOptions<TileComponentProps>,
    options?: TilePreferences,
  ): void;
  /**
   * Registers a tile for a Vue component.
   * @param component The Vue component.
   * @param preferences The optional preferences to be supplied to the Dashboard for the tile.
   */
  registerTileVue(component: FunctionalComponentOptions<TileComponentProps>, options?: TilePreferences): void;
  /**
   * Registers a route for a Vue component.
   * The route needs to be unique and can contain params.
   * Params are following the path-to-regexp notation, e.g., :id for an id parameter.
   * @param route The route to register.
   * @param component The Vue component.
   */
  registerPageVue(route: string, component: FunctionalComponentOptions<PageComponentProps>): void;
  /**
   * Registers an extension component with a Vue component.
   * The slot name must refer to the extension slot.
   * @param name The global name of the extension slot.
   * @param component The Vue component.
   * @param defaults Optionally, sets the default values for the expected data.
   */
  registerExtensionVue<TOpt>(
    name: string,
    component: FunctionalComponentOptions<ExtensionComponentProps<TOpt>>,
    defaults?: PiletApi,
  ): void;
  /**
   * Registers a menu item for a Vue component.
   * The id parameter has to be unique within the current pilet.
   * @param id The name of the menu.
   * @param component The Vue component.
   * @param settings The optional configuration for the menu item.
   */
  registerMenuVue(id: string, component: FunctionalComponentOptions<MenuComponentProps>, settings?: MenuSettings): void;
  /**
   * Registers a menu item for a Vue component.
   * @param component The Vue component.
   * @param settings The optional configuration for the menu item.
   */
  registerMenuVue(component: FunctionalComponentOptions<MenuComponentProps>, settings?: MenuSettings): void;
  /**
   * Registers a modal dialog using a Vue component.
   * @param id The name of the modal dialog.
   * @param component The Vue component.
   * @param defaults Optionally, sets the default values for the inserted options.
   */
  registerModalVue<TOpt>(
    id: string,
    component: FunctionalComponentOptions<ModalComponentProps<TOpt>>,
    defaults?: PiletApi,
  ): void;
}
