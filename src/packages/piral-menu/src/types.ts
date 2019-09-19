import { ComponentType } from 'react';
import { WrappedComponent, Dict, BaseComponentProps, ForeignComponent } from 'piral-core';

declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends PiletMenuApi {}

  interface PiralCustomState {}

  interface PiralCustomActions {
    /**
     * Registers a new menu item.
     * @param name The name of the menu item.
     * @param value The menu registration.
     */
    registerMenuItem(name: string, value: MenuItemRegistration): void;
    /**
     * Unregisters an existing menu item.
     * @param name The name of the menu item to be removed.
     */
    unregisterMenuItem(name: string): void;
  }

  interface PiralCustomComponentsState {
    /**
     * The registered menu items for global display.
     */
    menuItems: Dict<MenuItemRegistration>;
  }
}

export interface MenuComponentProps extends BaseComponentProps {}

export interface MenuSettings {
  /**
   * Sets the type of the menu to attach to.
   * @default "general"
   */
  type?: MenuType;
}

export type MenuType = 'general' | 'admin' | 'user' | 'header' | 'footer';

export interface MenuItemRegistration {
  component: WrappedComponent<MenuComponentProps>;
  settings: MenuSettings;
}

export interface PiletMenuApi {
  /**
   * Registers a menu item for general components.
   * The name has to be unique within the current pilet.
   * @param name The name of the menu item.
   * @param render The function that is being called once rendering begins.
   * @param settings The optional configuration for the menu item.
   */
  registerMenuX(name: string, render: ForeignComponent<MenuComponentProps>, settings?: MenuSettings): void;
  /**
   * Registers a menu item for general components.
   * @param render The function that is being called once rendering begins.
   * @param settings The optional configuration for the menu item.
   */
  registerMenuX(render: ForeignComponent<MenuComponentProps>, settings?: MenuSettings): void;
  /**
   * Registers a menu item for React components.
   * The name has to be unique within the current pilet.
   * @param name The name of the menu item.
   * @param Component The component to be rendered within the menu.
   * @param settings The optional configuration for the menu item.
   */
  registerMenu(name: string, Component: ComponentType<MenuComponentProps>, settings?: MenuSettings): void;
  /**
   * Registers a menu item for React components.
   * @param Component The component to be rendered within the menu.
   * @param settings The optional configuration for the menu item.
   */
  registerMenu(Component: ComponentType<MenuComponentProps>, settings?: MenuSettings): void;
  /**
   * Unregisters a menu item known by the given name.
   * Only previously registered menu items can be unregistered.
   * @param name The name of the menu item to unregister.
   */
  unregisterMenu(name: string): void;
}
