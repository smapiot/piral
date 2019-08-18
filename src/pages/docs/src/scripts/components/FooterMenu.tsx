import * as React from 'react';

export interface FooterMenuProps {
  title: string;
}

export const FooterMenu: React.FC<FooterMenuProps> = ({ title, children }) => (
  <div className="footer-menu">
    <h3>{title}</h3>
    <ul>{children}</ul>
  </div>
);
