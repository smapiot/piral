import { ReactChild, createElement } from 'react';
import { TiId, TiType } from './types';

export function gid(node: { id: TiId }) {
  return node.id && `ti-node-${node.id}`;
}

export function keyOf(node: TiType) {
  return node.id || `${node.name}-${~~(Math.random() * 1000)}`;
}

export function gref(id?: TiId) {
  return id && `#${gid({ id })}`;
}

export function withSep(items: Array<ReactChild>, sep: string) {
  const newItems: Array<ReactChild> = [];

  items.forEach((item, i) => {
    newItems.push(item, createElement('span', { key: i }, sep));
  });

  newItems.pop();
  return newItems;
}
