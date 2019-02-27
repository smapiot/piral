import * as React from 'react';
import { cn, IconName, ColorKind } from './utils';

export interface ButtonProps
  extends React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> {
  kind?: ColorKind;
  icon?: IconName;
}

export const Button: React.SFC<ButtonProps> = ({ kind = 'primary', icon, children, ...props }) => (
  <a href="#" {...props} className={cn('btn', `btn-${kind}`, icon && 'btn-cta')}>
    {icon && <i className={cn('fas', `fa-${icon}`)} />}
    {children}
  </a>
);
