import * as actions from './actions';
import { ComponentType } from 'react';
import { swap } from '@dbeining/react-atom';
import { withApi, buildName, Extend, Dict } from 'piral-core';
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
 * Available configuration options for the menu extension.
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
      component,
      settings: getSettings(defaultSettings, settings),
    };
  }

  return menuItems;
}

/**
 * Creates a new set of Piral API extensions for integration of menu items.
 */
export function createMenuApi(config: MenuConfig = {}): Extend<PiletMenuApi> {
  const { items = [], defaultSettings = {} } = config;

  return context => {
    context.defineActions(actions);

    swap(context.state, state => ({
      ...state,
      components: {
        ...state.components,
        menuItems: getMenuItems(items, defaultSettings),
      },
    }));

    return (api, target) => {
      const prefix = target.name;
      let next = 0;

      return {
        registerMenu(name, arg, settings?) {
          if (typeof name !== 'string') {
            settings = arg;
            arg = name;
            name = next++;
          }

          const id = buildName(prefix, name);
          context.registerMenuItem(id, {
            component: withApi(context.converters, arg, api, 'menu'),
            settings: getSettings(defaultSettings, settings),
          });
        },
        unregisterMenu(name) {
          const id = buildName(prefix, name);
          context.unregisterMenuItem(id);
        },
      };
    };
  };
}
