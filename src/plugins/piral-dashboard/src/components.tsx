import * as React from 'react';
import { getPiralComponent } from 'piral-core';
import { DashboardContainerProps, DashboardTileProps } from './types';

export const PiralDashboardContainer: React.ComponentType<DashboardContainerProps> =
  getPiralComponent('DashboardContainer');
export const PiralDashboardTile: React.ComponentType<DashboardTileProps> = getPiralComponent('DashboardTile');
