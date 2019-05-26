import * as React from 'react';
import { TiNode } from './types';
import { Callout } from '../Callout';
import { gid } from './utils';
import { TypeRenderer } from './TypeRenderer';

export interface TypeAliasRendererProps {
  node: TiNode;
  render(child: TiNode): JSX.Element;
}

export const TypeAliasRenderer: React.SFC<TypeAliasRendererProps> = ({ node, render }) => (
  <Callout type="info" title={node.name} icon="puzzle-piece" id={gid(node)}>
    <p>
      <b>{node.kindString}</b>
    </p>
    <span className="block">
      <code>
        <TypeRenderer node={node.type} render={render} />
      </code>
    </span>
  </Callout>
);
