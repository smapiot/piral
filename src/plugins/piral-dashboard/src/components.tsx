import { ComponentType } from 'react';
import { getPiralComponent } from 'piral-core';
import { DashboardContainerProps, DashboardTileProps } from './types';

export const PiralDashboardContainer: ComponentType<DashboardContainerProps> = getPiralComponent('DashboardContainer');
export const PiralDashboardTile: ComponentType<DashboardTileProps> = getPiralComponent('DashboardTile');
