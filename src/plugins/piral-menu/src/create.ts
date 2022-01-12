import * as actions from './actions';
import { ComponentType } from 'react';
import { withApi, buildName, PiralPlugin, Dict, withAll, withRootExtension, GlobalState } from 'piral-core';
import { DefaultContainer, DefaultItem } from './default';
import { Menu } from './Menu';
import { PiletMenuApi, MenuSettings, MenuItemRegistration } from './types';

export interface InitialMenuItem {
  /**
   * The optional menu settings.
   */
  settings?: MenuSettings;
  /**
   * The menu component to use.
   */
  component: ComponentType;
}

/**
 * Available configuration options for the menu plugin.
 */
export interface MenuConfig {
  /**
   * The initial menu items.
   * @default []
   */
  items?: Array<InitialMenuItem>;
  /**
   * Sets the default settings to be used.
   * @default {}
   */
  defaultSettings?: MenuSettings;
}

function getSettings(defaultSettings: MenuSettings, customSettings: MenuSettings = {}): MenuSettings {
  return {
    type: 'general',
    ...defaultSettings,
    ...customSettings,
  };
}

function getMenuItems(items: Array<InitialMenuItem>, defaultSettings: MenuSettings) {
  const menuItems: Dict<MenuItemRegistration> = {};
  let i = 0;

  for (const { component, settings } of items) {
    menuItems[`global-${i++}`] = {
      pilet: undefined,
      component,
      settings: getSettings(defaultSettings, settings),
    };
  }

  return menuItems;
}

function withMenu(menuItems: Dict<MenuItemRegistration>) {
  return (state: GlobalState): GlobalState => ({
    ...state,
    components: {
      MenuContainer: DefaultContainer,
      MenuItem: DefaultItem,
      ...state.components,
    },
    registry: {
      ...state.registry,
      menuItems,
    },
  });
}

/**
 * Creates new Pilet API extensions for integration of menu items.
 */
export function createMenuApi(config: MenuConfig = {}): PiralPlugin<PiletMenuApi> {
  const { items = [], defaultSettings = {} } = config;

  return (context) => {
    context.defineActions(actions);

    context.dispatch(withAll(withMenu(getMenuItems(items, defaultSettings)), withRootExtension('piral-menu', Menu)));

    return (api, target) => {
      const pilet = target.name;
      let next = 0;

      return {
        registerMenu(name, arg, settings?) {
          if (typeof name !== 'string') {
            settings = arg;
            arg = name;
            name = next++;
          }

          const id = buildName(pilet, name);
          context.registerMenuItem(id, {
            pilet,
            component: withApi(context, arg, api, 'menu'),
            settings: getSettings(defaultSettings, settings),
          });
          return () => api.unregisterMenu(name);
        },
        unregisterMenu(name) {
          const id = buildName(pilet, name);
          context.unregisterMenuItem(id);
        },
      };
    };
  };
}
