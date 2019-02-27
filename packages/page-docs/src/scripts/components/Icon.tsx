import * as React from 'react';
import { IconName, cn } from './utils';

export interface IconProps {
  content?: IconName | React.ReactElement;
}

export const Icon: React.SFC<IconProps> = ({ content = null }) =>
  (typeof content === 'string' && <i className={cn('icon', 'fa', `fa-${content}`)} />) ||
  (content as React.ReactElement);
