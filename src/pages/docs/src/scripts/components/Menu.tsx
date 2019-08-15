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
        <a className={`nav-link ${item.active ? 'active' : ''}`} href={item.href}>
          {item.title}
        </a>
        {item.children.length > 0 && (
          <nav className="doc-sub-menu">{renderMenuItems(item.children, maxLevel, level + 1)}</nav>
        )}
      </React.Fragment>
    ));
  }

  return [];
}

export const Menu: React.FC<MenuProps> = ({ content, maxLevel }) => {
  const items = useMenuItems(content);
  return <Sidebar>{renderMenuItems(items, maxLevel)}</Sidebar>;
};
