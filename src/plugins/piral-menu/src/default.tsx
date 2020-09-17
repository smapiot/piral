import * as React from 'react';
import { defaultRender, ExtensionSlot } from 'piral-core';
import { MenuContainerProps, MenuItemProps } from './types';

export const DefaultContainer: React.FC<MenuContainerProps> = (props) => (
  <ExtensionSlot
    name={`menu_${props.type}`}
    params={props}
    empty={() => defaultRender(props.children, 'default_menu')}
  />
);

export const DefaultItem: React.FC<MenuItemProps> = (props) => defaultRender(props.children);
