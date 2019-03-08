import * as React from 'react';
import { Link } from 'react-router-dom';
import { cn, IconName, ColorKind } from './utils';

export interface ButtonProps
  extends React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> {
  kind?: ColorKind;
  icon?: IconName;
  to?: string;
}

export const Button: React.SFC<ButtonProps> = ({ kind = 'primary', icon, children, to, ...props }) =>
  React.createElement(
    to ? Link : 'a',
    {
      href: '#',
      ...props,
      className: cn('btn', `btn-${kind}`, icon && 'btn-cta'),
      to,
    },
    icon && <i className={cn('fas', `fa-${icon}`)} />,
    children,
  );
