import * as React from 'react';
import { cn, IconName } from './utils';

export interface CalloutProps {
  title?: string;
  id?: string;
  type?: 'success' | 'info' | 'warning' | 'danger';
  icon?: IconName;
}

export const Callout: React.FC<CalloutProps> = ({ title, type = 'info', icon, id, children }) => (
  <div className={cn('callout-block', `callout-${type}`)} id={id}>
    <div className="icon-holder">{icon && <i className={cn('fas', `fa-${icon}`)} />}</div>
    <div className="content">
      {title && <h4 className="callout-title">{title}</h4>}
      {children}
    </div>
  </div>
);
