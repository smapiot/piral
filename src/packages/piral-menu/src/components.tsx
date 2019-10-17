import * as React from 'react';
import { getPiralComponent } from 'piral-core';
import { MenuContainerProps, MenuItemProps } from './types';

export const PiralMenuContainer: React.ComponentType<MenuContainerProps> = getPiralComponent('MenuContainer');
export const PiralMenuItem: React.ComponentType<MenuItemProps> = getPiralComponent('MenuItem');
