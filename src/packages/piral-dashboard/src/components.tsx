import * as React from 'react';
import { getPiralComponent } from 'piral-core';
import { DashboardProps, TileProps } from './types';

export const PiralDashboardContainer: React.ComponentType<DashboardProps> = getPiralComponent('Dashboard');
export const PiralDashboardTile: React.ComponentType<TileProps> = getPiralComponent('Tile');
