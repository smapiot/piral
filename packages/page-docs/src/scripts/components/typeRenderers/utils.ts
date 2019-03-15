import { TiNode } from './types';

export function gid(node: TiNode) {
  return `ti-node-${node.id}`;
}
