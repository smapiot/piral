import * as React from 'react';
import { TiNode } from './types';
import { Callout } from '../Callout';
import { TypeRenderer } from './TypeRenderer';

export interface VariableRendererProps {
  node: TiNode;
  render(child: TiNode): JSX.Element;
}

export const VariableRenderer: React.SFC<VariableRendererProps> = ({ node, render }) => (
  <Callout type="warning" title={node.name} icon="puzzle-piece">
    <p>
      <b>{node.kindString}</b>
    </p>
    <p>{node.comment && node.comment.shortText}</p>
    <p>
      <code>
        {node.name}: <TypeRenderer render={render} node={node.type} /> = {node.defaultValue}
      </code>
    </p>
  </Callout>
);
