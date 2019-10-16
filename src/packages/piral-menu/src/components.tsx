import * as React from 'react';
import { getPiralComponent } from 'piral-core';
import { MenuProps, MenuItemProps } from './types';

export const PiralMenuContainer: React.ComponentType<MenuProps> = getPiralComponent('Menu');
export const PiralMenuItem: React.ComponentType<MenuItemProps> = getPiralComponent('MenuItem');
