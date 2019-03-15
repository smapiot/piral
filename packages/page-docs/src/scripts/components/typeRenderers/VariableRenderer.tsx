import * as React from 'react';
import { TiNode } from './types';
import { Callout } from '../Callout';

export interface VariableRendererProps {
  node: TiNode;
}

export const VariableRenderer: React.SFC<VariableRendererProps> = ({ node }) => (
  <Callout type="warning" title={node.name} icon="puzzle-piece">
    <p>
      <b>{node.kindString}</b>
    </p>
    <p>{node.comment && node.comment.shortText}</p>
    <p>{node.type.name}</p>
  </Callout>
);
