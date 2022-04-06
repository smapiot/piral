import * as React from 'react';
import { defaultRender } from '../utils';
import { LayoutProps } from '../types';

/**
 * The default layout only rendering the provided children.
 */
export const DefaultLayout: React.FC<LayoutProps> = ({ children }) => defaultRender(children);
DefaultLayout.displayName = 'DefaultLayout';
