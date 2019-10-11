import * as React from 'react';
import { useGlobalState } from 'piral-core';
import { MenuType } from 'piral-ext';
import { MenuContainerProps, MenuItemProps, MenuProps } from '../types';

export interface MenuCreator {
  MenuContainer: React.ComponentType<MenuContainerProps>;
  MenuItem: React.ComponentType<MenuItemProps>;
}

export function createMenu({ MenuContainer, MenuItem }: MenuCreator): React.FC<MenuProps> {
  return ({ type = 'general' as MenuType }) => {
    const menuItems = useGlobalState(s => s.components.menuItems);
    const renderItems = Object.keys(menuItems)
      .filter(name => menuItems[name].settings.type === type)
      .map(name => ({
        name,
        Component: menuItems[name].component,
      }));

    return (
      <MenuContainer type={type}>
        {renderItems.map(({ name, Component }) => (
          <MenuItem key={name} type={type}>
            <Component />
          </MenuItem>
        ))}
      </MenuContainer>
    );
  };
}
