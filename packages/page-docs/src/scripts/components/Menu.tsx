import * as React from 'react';
import { Sidebar } from './Sidebar';
import { MenuItems, useMenuItems } from '../hooks';

export interface MenuProps {
  content?: React.RefObject<HTMLDivElement>;
  maxLevel?: number;
}
function renderMenuItems(items: MenuItems, maxLevel = Number.MAX_VALUE, level = 1) {
  if (maxLevel >= level) {
    return items.map(item => (
      <React.Fragment key={item.href}>
        <a className="nav-link scrollto" href={item.href}>
          {item.title}
        </a>
        <nav className="doc-sub-menu nav flex-column">{renderMenuItems(item.children, maxLevel, level + 1)}</nav>
      </React.Fragment>
    ));
  }

  return [];
}

export const Menu: React.SFC<MenuProps> = ({ content, maxLevel }) => {
  const items = useMenuItems(content && content.current);
  return <Sidebar>{renderMenuItems(items, maxLevel)}</Sidebar>;
};
