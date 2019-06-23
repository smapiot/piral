import { FunctionalComponentOptions } from 'vue';
import {
  PiralCoreApi,
  TilePreferences,
  MenuSettings,
  TileComponentProps,
  ModalComponentProps,
  MenuComponentProps,
  ExtensionComponentProps,
  PageComponentProps,
} from 'piral-core';
import { mount } from './mount';

/**
 * Defines the provided set of Vue Pilet API extensions.
 */
export interface PiralVueApi<T = PiralCoreApi<{}>> {
  /**
   * Registers a tile for a Vue component.
   * @param id The name of the tile.
   * @param component The Vue component.
   * @param preferences The optional preferences to be supplied to the Dashboard for the tile.
   */
  registerTileVue(
    id: string,
    component: FunctionalComponentOptions<TileComponentProps<T>>,
    options?: TilePreferences,
  ): void;
  /**
   * Registers a route for a Vue component.
   * The route needs to be unique and can contain params.
   * Params are following the path-to-regexp notation, e.g., :id for an id parameter.
   * @param route The route to register.
   * @param component The Vue component.
   */
  registerPageVue(route: string, component: FunctionalComponentOptions<PageComponentProps<T>>): void;
  /**
   * Registers an extension component with a Vue component.
   * The slot name must refer to the extension slot.
   * @param name The global name of the extension slot.
   * @param component The Vue component.
   * @param defaults Optionally, sets the default values for the expected data.
   */
  registerExtensionVue<TOpt>(
    name: string,
    component: FunctionalComponentOptions<ExtensionComponentProps<T, TOpt>>,
    defaults?: T,
  ): void;
  /**
   * Registers a menu item for a Vue component.
   * The name has to be unique within the current pilet.
   * @param id The name of the menu.
   * @param component The Vue component.
   * @param settings The optional configuration for the menu item.
   */
  registerMenuVue(
    id: string,
    component: FunctionalComponentOptions<MenuComponentProps<T>>,
    settings: MenuSettings,
  ): void;
  /**
   * Registers a modal dialog using a Vue component.
   * @param id The name of the modal dialog.
   * @param component The Vue component.
   * @param defaults Optionally, sets the default values for the inserted options.
   */
  registerModalVue<TOpt>(
    id: string,
    component: FunctionalComponentOptions<ModalComponentProps<T, TOpt>>,
    defaults?: T,
  ): void;
}

/**
 * Creates a new set of Piral Vue API extensions.
 * @param api The API to extend.
 */
export function createVueApi<T = {}>(api: PiralCoreApi<T>): PiralVueApi<PiralCoreApi<T>> {
  return {
    registerTileVue(id, root, options) {
      api.registerTileX(id, (el, props, ctx) => mount(el, root, props, ctx), options);
    },
    registerPageVue(route, root) {
      api.registerPageX(route, (el, props, ctx) => mount(el, root, props, ctx));
    },
    registerExtensionVue<TOpt>(slot, root, defaults) {
      api.registerExtensionX<TOpt>(slot, (el, props, ctx) => mount(el, root, props, ctx), defaults);
    },
    registerMenuVue(id, root, settings) {
      api.registerMenuX(id, (el, props, ctx) => mount(el, root, props, ctx), settings);
    },
    registerModalVue<TOpt>(id, root, defaults) {
      api.registerModalX<TOpt>(id, (el, props, ctx) => mount(el, root, props, ctx), defaults);
    },
  };
}
