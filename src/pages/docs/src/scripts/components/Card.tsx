import * as React from 'react';
import { Link } from 'react-router-dom';
import { IconName, cn, ColorKind } from './utils';
import { Icon } from './Icon';

export interface CardProps {
  icon?: IconName;
  title?: string;
  to?: string;
  kind?: ColorKind;
}

export const Card: React.FC<CardProps> = ({ kind = 'green', icon, to, title, children }) => (
  <div className={cn('item', `item-${kind}`, 'col-lg-4', 'col-md-6', 'col-12')}>
    <div className="item-inner">
      <div className="icon-holder">
        <Icon content={icon} />
      </div>
      {title && <h3 className="title">{title}</h3>}
      <p className="intro">{children}</p>
      {to && (
        <Link className="link" to={to}>
          <span />
        </Link>
      )}
    </div>
  </div>
);
