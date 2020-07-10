import * as React from 'react';
import { Link } from 'react-router-dom';
import { usePage } from './PageContext';
import { Sidebar } from './Sidebar';
import { MenuItems, useMenuItems } from '../hooks';

export interface TocMenuProps {}

function c(...items: Array<string | boolean | number>) {
  return items.filter(item => !!item).join(' ');
}

function renderMenuItems(items: MenuItems, level = 1) {
  return (
    <ul className="toc-list">
      {items.map(item => (
        <li key={item.href} className={c(item.active && 'active')}>
          <Link className={c(`level-${level}`, item.children.length && 'children')} to={item.href}>
            {item.title}
          </Link>
          {item.children.length > 0 && renderMenuItems(item.children, level + 1)}
        </li>
      ))}
    </ul>
  );
}

export const TocMenu: React.FC = () => {
  const { current } = usePage();
  const items = useMenuItems(current);
  return <Sidebar className="toc-nav">{renderMenuItems(items)}</Sidebar>;
};
