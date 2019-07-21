import * as React from 'react';
import { LayoutProps } from 'piral';
import { MenuToggle } from './MenuToggle';
import { User } from './User';
import { LanguagePicker } from './LanguagePicker';

export const Layout: React.FC<LayoutProps> = ({
  Menu,
  Notifications,
  Search,
  children,
  Modals,
  selectedLanguage,
  availableLanguages,
}) => (
  <div className="app-container">
    <div className="app-menu">
      <div className="app-menu-content">
        <Menu type="general" />
        <Menu type="admin" />
      </div>
    </div>
    <Notifications />
    <Modals />
    <div className="app-header">
      <div className="app-title">
        <MenuToggle />
        <h1>Piral Sample</h1>
      </div>
      <Search />
      <Menu type="header" />
      <LanguagePicker selected={selectedLanguage} available={availableLanguages} />
      <User />
    </div>
    <div className="app-content">{children}</div>
    <div className="app-footer">
      <Menu type="footer" />
    </div>
  </div>
);
