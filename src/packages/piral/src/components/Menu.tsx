import * as React from 'react';
import { useGlobalState, MenuType } from 'piral-core';
import { MenuContainerProps, MenuItemProps, MenuProps } from '../types';

export interface MenuCreator {
  MenuContainer: React.ComponentType<MenuContainerProps>;
  MenuItem: React.ComponentType<MenuItemProps>;
}

export function createMenu({ MenuContainer, MenuItem }: MenuCreator): React.FC<MenuProps> {
  return ({ type = 'general' as MenuType }) => {
    const menuItems = useGlobalState(s => s.components.menuItems);

    return (
      <MenuContainer type={type}>
        {Object.keys(menuItems).map(name => {
          const item = menuItems[name];

          if (item.settings.type === type) {
            const Component = item.component;
            return (
              <MenuItem key={name} type={type}>
                <Component />
              </MenuItem>
            );
          }

          return undefined;
        })}
      </MenuContainer>
    );
  };
}
