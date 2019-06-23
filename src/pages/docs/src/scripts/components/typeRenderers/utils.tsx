import * as React from 'react';
import { TiType, TiNode } from './types';

export function gid(node: TiType | TiNode) {
  return node.id && `ti-node-${node.name || 'id'}-${node.id}`;
}

export function keyOf(node: TiType) {
  return node.id || `${node.name}-${~~(Math.random() * 1000)}`;
}

export function gref(node: TiType) {
  return node && node.id && `#${gid(node)}`;
}

export function withSep(items: Array<React.ReactChild>, sep: string) {
  const newItems: Array<React.ReactChild> = [];

  items.forEach((item, i) => {
    newItems.push(item, <span key={i}>{sep}</span>);
  });

  newItems.pop();
  return newItems;
}
