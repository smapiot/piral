import * as React from 'react';
import { LayoutProps } from '../types';
import { defaultRender } from '../utils';

export const DefaultLayout: React.FC<LayoutProps> = ({ children }) => defaultRender(children);
DefaultLayout.displayName = 'DefaultLayout';
