import * as React from 'react';
import { TypeRenderer } from './TypeRenderer';
import { TiNode } from './types';
import { Details } from './Details';

export interface VariableRendererProps {
  node: TiNode;
  render(child: TiNode): JSX.Element;
}

export const VariableRenderer: React.SFC<VariableRendererProps> = ({ node, render }) => (
  <Details
    color="purple"
    title={
      <>
        <b>{node.kindString}</b>
        <h3>{node.name}</h3>
        <p>{node.comment && node.comment.shortText}</p>
      </>
    }
    details={
      <p>
        <code>
          {node.name}: <TypeRenderer render={render} node={node.type} />
        </code>
      </p>
    }
  />
);
