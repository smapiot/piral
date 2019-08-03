import {
  TilePreferences,
  MenuSettings,
  TileComponentProps,
  ModalComponentProps,
  MenuComponentProps,
  ExtensionComponentProps,
  PageComponentProps,
} from 'piral-core';

/** The view function describes the application UI as a tree of VNodes.
 * @returns A VNode tree.
 * @memberOf [App]
 */
export interface View<State, Actions> {
  (state: State, actions: Actions): VNode<object> | null;
}

/** The VDOM representation of an Element.
 *
 * @memberOf [VDOM]
 */
export interface VNode<Attributes = {}> {
  nodeName: string;
  attributes?: Attributes;
  children: Array<VNode | string>;
  key: string | number | null;
}

/** A Component is a function that returns a custom VNode or View.
 *
 * @memberOf [VDOM]
 */
export interface Component<Attributes = {}, State = {}, Actions = {}> {
  (attributes: Attributes, children: Array<VNode | string>): VNode<Attributes> | View<State, Actions>;
}

/**
 * Defines the provided set of hyperapp Pilet API extensions.
 */
export interface PiralHyperappApi<T> {
  /**
   * Registers a tile for a hyperapp component.
   * The id parameter has to be unique within the current pilet.
   * @param id The name of the tile.
   * @param component The hyperapp component.
   * @param preferences The optional preferences to be supplied to the Dashboard for the tile.
   */
  registerTileHyperapp<State = {}, Actions = {}>(
    id: string,
    component: Component<TileComponentProps<T>>,
    state?: State,
    actions?: Actions,
    options?: TilePreferences,
  ): void;
  /**
   * Registers a tile for a hyperapp component.
   * @param component The hyperapp component.
   * @param preferences The optional preferences to be supplied to the Dashboard for the tile.
   */
  registerTileHyperapp<State = {}, Actions = {}>(
    component: Component<TileComponentProps<T>>,
    state?: State,
    actions?: Actions,
    options?: TilePreferences,
  ): void;
  /**
   * Registers a route for a hyperapp component.
   * The route needs to be unique and can contain params.
   * Params are following the path-to-regexp notation, e.g., :id for an id parameter.
   * @param route The route to register.
   * @param component The hyperapp component.
   */
  registerPageHyperapp<State = {}, Actions = {}>(
    route: string,
    component: Component<PageComponentProps<T>>,
    state?: State,
    actions?: Actions,
  ): void;
  /**
   * Registers an extension component with a hyperapp component.
   * The slot name must refer to the extension slot.
   * @param name The global name of the extension slot.
   * @param component The hyperapp component.
   * @param defaults Optionally, sets the default values for the expected data.
   */
  registerExtensionHyperapp<TOpt, State = {}, Actions = {}>(
    name: string,
    component: Component<ExtensionComponentProps<T, TOpt>>,
    state?: State,
    actions?: Actions,
    defaults?: T,
  ): void;
  /**
   * Registers a menu item for a hyperapp component.
   * The id parameter has to be unique within the current pilet.
   * @param id The name of the menu.
   * @param component The hyperapp component.
   * @param settings The optional configuration for the menu item.
   */
  registerMenuHyperapp<State = {}, Actions = {}>(
    id: string,
    component: Component<MenuComponentProps<T>>,
    state?: State,
    actions?: Actions,
    settings?: MenuSettings,
  ): void;
  /**
   * Registers a menu item for a hyperapp component.
   * @param component The hyperapp component.
   * @param settings The optional configuration for the menu item.
   */
  registerMenuHyperapp<State = {}, Actions = {}>(
    component: Component<MenuComponentProps<T>>,
    state?: State,
    actions?: Actions,
    settings?: MenuSettings,
  ): void;
  /**
   * Registers a modal dialog using a hyperapp component.
   * @param id The name of the modal dialog.
   * @param component The hyperapp component.
   * @param defaults Optionally, sets the default values for the inserted options.
   */
  registerModalHyperapp<TOpt, State = {}, Actions = {}>(
    id: string,
    component: Component<ModalComponentProps<T, TOpt>>,
    state?: State,
    actions?: Actions,
    defaults?: T,
  ): void;
}
