import { ComponentType } from 'react';
import { getPiralComponent } from 'piral-core';
import { BreadcrumbsContainerProps, BreadcrumbItemProps } from './types';

export const PiralBreadcrumbsContainer: ComponentType<BreadcrumbsContainerProps> =
  getPiralComponent('BreadcrumbsContainer');
export const PiralBreadcrumbItem: ComponentType<BreadcrumbItemProps> = getPiralComponent('BreadcrumbItem');
