import * as React from 'react';
import { useGlobalState } from 'piral-core';

export interface MenuProps {
  type?: string;
}

export const Menu: React.SFC<MenuProps> = ({ type = 'general' }) => {
  const menuItems = useGlobalState(s => s.components.menuItems);

  return (
    <pi-menu>
      {Object.keys(menuItems).map(name => {
        const item = menuItems[name];

        if (item.settings.type === type) {
          const Component = item.component;
          return (
            <pi-item key={name}>
              <Component />
            </pi-item>
          );
        }

        return undefined;
      })}
    </pi-menu>
  );
};
