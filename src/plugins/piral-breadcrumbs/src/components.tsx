import * as React from 'react';
import { getPiralComponent } from 'piral-core';
import { BreadcrumbsContainerProps, BreadcrumbItemProps } from './types';

export const PiralBreadcrumbsContainer: React.ComponentType<BreadcrumbsContainerProps> =
  getPiralComponent('BreadcrumbsContainer');
export const PiralBreadcrumbItem: React.ComponentType<BreadcrumbItemProps> = getPiralComponent('BreadcrumbItem');
