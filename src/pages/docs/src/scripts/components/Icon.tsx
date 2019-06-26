import * as React from 'react';
import { IconName, cn } from './utils';

export interface IconProps {
  content?: IconName;
}

// tslint:disable-next-line
const defaultIcon = null;

export const Icon: React.FC<IconProps> = ({ content = defaultIcon }) =>
  (typeof content === 'string' && <i className={cn('icon', 'fa', `fa-${content}`)} />) || content;
