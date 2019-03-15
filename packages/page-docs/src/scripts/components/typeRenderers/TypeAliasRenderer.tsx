import * as React from 'react';
import { TiNode } from './types';
import { Callout } from '../Callout';

export interface TypeAliasRendererProps {
  node: TiNode;
}

export const TypeAliasRenderer: React.SFC<TypeAliasRendererProps> = ({ node }) => (
  <Callout type="info" title={node.name} icon="puzzle-piece">
    <p>
      <b>{node.kindString}</b>
    </p>
  </Callout>
);
