import * as React from 'react';
import { cn } from '../components';

export interface HeaderProps {
  centered?: boolean;
}

export const Header: React.SFC<HeaderProps> = ({ centered, children }) => (
  <header className={cn('header', centered && 'text-center')}>
    <div className="container">
      <div className="branding">
        <h1 className="logo">
          <a href="/">
            <span aria-hidden="true" className="icon_documents_alt icon" />
            <span className="text-highlight">Pretty</span>
            <span className="text-bold">Docs</span>
          </a>
        </h1>
      </div>
      {children}
    </div>
  </header>
);
