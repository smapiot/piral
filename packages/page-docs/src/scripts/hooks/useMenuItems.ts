import { useState, useEffect } from 'react';

export interface MenuItem {
  href: string;
  title: string;
  children: MenuItems;
}

export type MenuItems = Array<MenuItem>;

function extractSubMenuItems(container: HTMLElement): MenuItems {
  const titles = container.querySelectorAll('h3');
  return Array.prototype.map.call(titles, title => ({
    href: `#${title.id}`,
    title: title.textContent,
    children: [],
  }));
}

function extractMenuItems(container: HTMLElement): MenuItems {
  const sections = container.querySelectorAll('section.doc-section');
  return Array.prototype.map.call(sections, section => ({
    href: `#${section.id}`,
    title: section.querySelector('.section-title').textContent,
    children: extractSubMenuItems(section),
  }));
}

export function useMenuItems(content: HTMLElement) {
  const [items, setItems] = useState<MenuItems>([]);
  useEffect(() => {
    setItems((content && extractMenuItems(content)) || []);
  }, [content]);
  return items;
}
