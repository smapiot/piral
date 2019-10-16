import * as React from 'react';
import { defaultRender, ExtensionSlot } from 'piral-core';
import { MenuProps, MenuItemProps } from './types';

export const DefaultMenu: React.FC<MenuProps> = props => (
  <ExtensionSlot
    name={`menu_${props.type}`}
    params={props}
    empty={() => <React.Fragment key="default_menu">{props.children}</React.Fragment>}
  />
);

export const DefaultMenuItem: React.FC<MenuItemProps> = props => defaultRender(props.children);
