import * as React from 'react';
import { cn, IconName } from './utils';

export interface CalloutProps {
  title?: string;
  type?: 'success' | 'info' | 'warning' | 'danger';
  icon?: IconName;
}

export const Callout: React.SFC<CalloutProps> = ({ title, type = 'info', icon, children }) => (
  <div className={cn('callout-block', `callout-${type}`)}>
    <div className="icon-holder">
      {icon && <i className={cn('fas', `fa-${icon}`)} />}
    </div>
    <div className="content">
      {title && <h4 className="callout-title">{title}</h4>}
      {children}
    </div>
  </div>
);
