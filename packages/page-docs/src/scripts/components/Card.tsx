import * as React from 'react';
import { IconName, cn, ColorKind } from './utils';
import { Icon } from './Icon';

export interface CardProps {
  icon?: IconName | React.ReactElement;
  title?: string;
  to?: string;
  kind?: ColorKind;
}

export const Card: React.SFC<CardProps> = ({ kind = 'green', icon, to, title, children }) => (
  <div className={cn('item', `item-${kind}`, 'col-lg-4', 'col-md-6', 'col-12')}>
    <div className="item-inner">
      <div className="icon-holder">
        <Icon content={icon} />
      </div>
      {title && <h3 className="title">{title}</h3>}
      <p className="intro">{children}</p>
      {to && (
        <a className="link" href={to}>
          <span />
        </a>
      )}
    </div>
  </div>
);
