import * as React from 'react';
import { LayoutProps } from '../types';
import { defaultRender } from '../utils';

/**
 * The default layout only rendering the provided children.
 */
export const DefaultLayout: React.FC<LayoutProps> = ({ children }) => defaultRender(children);
DefaultLayout.displayName = 'DefaultLayout';
