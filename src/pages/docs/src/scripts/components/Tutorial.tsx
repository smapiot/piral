import * as React from 'react';
import { PageContent } from './PageContent';

export interface TutorialProps {
  meta?: any;
}

export const Tutorial: React.FC<TutorialProps> = ({ children }) => <PageContent>{children}</PageContent>;
