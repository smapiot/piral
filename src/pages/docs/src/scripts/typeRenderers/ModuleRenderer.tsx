import * as React from 'react';
import { TiNode } from './types';

export interface ModuleRendererProps {
  node: TiNode;
  render(child: TiNode): JSX.Element;
}

function isExported(node: TiNode) {
  const flags = node && node.flags;
  return flags && flags.isExported;
}

export const ModuleRenderer: React.FC<ModuleRendererProps> = ({ node, render }) => (
  <>{(node.children || []).map((child) => isExported(child) && <div key={child.id}>{render(child)}</div>)}</>
);
