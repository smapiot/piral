import * as React from 'react';
import { useGlobalState } from 'piral-core';
import { PiralMenuContainer, PiralMenuItem } from './components';
import { MenuProps } from './types';

export const Menu: React.FC<MenuProps> = ({ type = 'general' }) => {
  const menuItems = useGlobalState((s) => s.registry.menuItems);
  const renderItems = Object.keys(menuItems)
    .filter((name) => menuItems[name].settings.type === type)
    .map((name) => ({
      name,
      Component: menuItems[name].component,
      meta: menuItems[name].settings,
    }));
  const children = renderItems.map(({ name, Component, meta }) => (
    <PiralMenuItem key={name} type={type} meta={meta}>
      <Component />
    </PiralMenuItem>
  ));

  return <PiralMenuContainer type={type}>{children}</PiralMenuContainer>;
};
Menu.displayName = 'Menu';
