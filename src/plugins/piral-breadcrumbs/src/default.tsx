import * as React from 'react';
import { ExtensionSlot, defaultRender } from 'piral-core';
import { BreadcrumbsContainerProps, BreadcrumbItemProps } from './types';

export const DefaultBreadcrumbsContainer: React.FC<BreadcrumbsContainerProps> = (props) => (
  <ExtensionSlot name="breadcrumbs" params={props} empty={() => defaultRender(props.children, 'default_breadcrumbs')} />
);

export const DefaultBreadbrumbItem: React.FC<BreadcrumbItemProps> = (props) => defaultRender(props.children);
