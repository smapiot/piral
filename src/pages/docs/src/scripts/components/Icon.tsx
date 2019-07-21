import * as React from 'react';
import { IconName, cn } from './utils';

export interface IconProps {
  content?: IconName;
}

// tslint:disable-next-line
const defaultIcon = null;

function getIcon(content: string) {
  switch (content) {
    case 'brain':
    case 'monument':
      return `fas fa-${content}`;
    default:
      return `fa fa-${content}`;
  }
}

export const Icon: React.FC<IconProps> = ({ content = defaultIcon }) =>
  (typeof content === 'string' && <i className={cn('icon', getIcon(content))} />) || content;
