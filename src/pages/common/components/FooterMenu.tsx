import * as React from 'react';

export interface FooterMenuProps {
  title: string;
  children: React.ReactNode;
}

export const FooterMenu: React.FC<FooterMenuProps> = ({ title, children }) => (
  <div className="footer-menu">
    <h3>{title}</h3>
    <ul>{children}</ul>
  </div>
);
