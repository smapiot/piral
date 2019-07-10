import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { cn, IconName } from './utils';

export interface CalloutProps {
  title?: string;
  id?: string;
  type?: 'success' | 'info' | 'warning' | 'danger';
  icon?: IconName;
  to?: string;
}

const CalloutImpl: React.FC<CalloutProps & RouteComponentProps> = ({
  title,
  type = 'info',
  icon,
  id,
  children,
  history,
  to,
}) => (
  <div
    className={cn('callout-block', `callout-${type}`, to && 'callout-link')}
    id={id}
    onClick={() => to && history.push(to)}>
    <div className="icon-holder">{icon && <i className={cn('fas', `fa-${icon}`)} />}</div>
    <div className="content">
      {title && <h4 className="callout-title">{title}</h4>}
      {children}
    </div>
  </div>
);

export const Callout = withRouter(CalloutImpl);
