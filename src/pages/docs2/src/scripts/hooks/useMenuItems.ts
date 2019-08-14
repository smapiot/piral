import { useState, useEffect, RefObject } from 'react';

export interface MenuItem {
  href: string;
  title: string;
  children: MenuItems;
  active: boolean;
}

export type MenuItems = Array<MenuItem>;

function extractMenuItems(sections: NodeListOf<HTMLElement>, active: HTMLElement): MenuItems {
  const items = [];

  Array.prototype.forEach.call(sections, section => {
    if (section.localName === 'h1') {
      items.push({
        href: `#${section.id}`,
        title: section.textContent,
        active: section === active,
        children: [],
      });
    } else if (items.length > 0) {
      const last = items[items.length - 1];
      last.children.push({
        href: `#${section.id}`,
        title: section.textContent,
        active: section === active,
        children: [],
      });
    }
  });

  return items;
}

function seen(offset: number, position: number, height: number, last: boolean) {
  const value = offset - position;
  return value < 15 || (last && value < height);
}

export function useMenuItems(content: RefObject<HTMLElement>) {
  const [items, setItems] = useState<MenuItems>([]);
  useEffect(() => {
    if (content.current) {
      const sections = content.current.querySelectorAll<HTMLElement>('h1, h2');
      let active = undefined;
      const handler = () => {
        const position = document.documentElement.scrollTop;
        const height = document.documentElement.clientHeight;
        const length = sections.length;
        const newActive =
          Array.prototype.filter
            .call(sections, (section, i) => seen(section.offsetTop, position, height, i + 1 === length))
            .pop() || sections[0];

        if (active !== newActive) {
          setItems((content && extractMenuItems(sections, newActive)) || []);
          active = newActive;
        }
      };
      handler();
      document.addEventListener('scroll', handler);
      return () => document.removeEventListener('scroll', handler);
    }

    return () => {};
  }, [content.current]);
  return items;
}
