import { useState, useEffect, RefObject } from 'react';

export interface MenuItem {
  href: string;
  title: string;
  children: MenuItems;
  active: boolean;
  parent: MenuItem | undefined;
}

export type MenuItems = Array<MenuItem>;

function extractMenuItems(sections: NodeListOf<HTMLElement>, active: HTMLElement): MenuItems {
  const items: Array<MenuItem> = [];

  Array.prototype.forEach.call(sections, (section) => {
    let level = +section.localName.substr(1, 1) - 1;
    let last: MenuItem = {
      active: false,
      children: items,
      href: '',
      title: '',
      parent: undefined,
    };

    while (level-- > 0) {
      if (!last) {
        break;
      }

      if (level === 0) {
        const isActive = section === active;

        last.children.push({
          href: `#${section.id}`,
          title: section.textContent,
          active: isActive,
          parent: last,
          children: [],
        });

        if (isActive) {
          while (last !== undefined) {
            last.active = true;
            last = last.parent;
          }
        }
      } else {
        const items = last.children;
        last = items[items.length - 1];
      }
    }
  });

  return items;
}

function seen(offset: number, position: number, height: number, scrollHeight: number, last: boolean) {
  const value = offset - position;
  return value < 15 || (last && value + scrollHeight - offset < height - 15);
}

export function useMenuItems(current: HTMLElement) {
  const [items, setItems] = useState<MenuItems>([]);

  useEffect(() => {
    if (current) {
      const sections = current.querySelectorAll<HTMLElement>('h2, h3, h4, h5, h6');
      let active = undefined;

      const handler = () => {
        const position = document.documentElement.scrollTop;
        const height = document.documentElement.clientHeight;
        const scrollHeight = document.documentElement.scrollHeight;
        const length = sections.length;
        const newActive =
          Array.prototype.filter
            .call(sections, (section, i) => seen(section.offsetTop, position, height, scrollHeight, i + 1 === length))
            .pop() || sections[0];

        if (active !== newActive) {
          setItems(extractMenuItems(sections, newActive) || []);
          active = newActive;
        }
      };
      handler();
      document.addEventListener('scroll', handler);
      return () => document.removeEventListener('scroll', handler);
    }

    return () => {};
  }, [current]);

  return items;
}
