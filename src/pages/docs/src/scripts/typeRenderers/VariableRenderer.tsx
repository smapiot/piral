import * as React from 'react';
import { TypeRenderer } from './TypeRenderer';
import { Details } from './Details';
import { TiNode } from './types';

export interface VariableRendererProps {
  node: TiNode;
  render(child: TiNode): JSX.Element;
}

export const VariableRenderer: React.FC<VariableRendererProps> = ({ node, render }) => (
  <Details color="purple" kind={node.kindString} description={node.comment} title={node.name}>
    <p>
      <code>
        {node.name}: <TypeRenderer render={render} node={node.type} />
      </code>
    </p>
  </Details>
);
