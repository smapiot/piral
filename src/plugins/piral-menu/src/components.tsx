import type { ComponentType } from 'react';
import { getPiralComponent } from 'piral-core';
import { MenuContainerProps, MenuItemProps } from './types';

export const PiralMenuContainer: ComponentType<MenuContainerProps> = getPiralComponent('MenuContainer');
export const PiralMenuItem: ComponentType<MenuItemProps> = getPiralComponent('MenuItem');
