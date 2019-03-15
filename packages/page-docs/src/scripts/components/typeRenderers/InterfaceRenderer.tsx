import * as React from 'react';
import { TiNode } from './types';
import { Callout } from '../Callout';

export interface InterfaceRendererProps {
  node: TiNode;
}

export const InterfaceRenderer: React.SFC<InterfaceRendererProps> = ({ node }) => (
  <Callout type="info" title={node.name} icon="puzzle-piece">
    <p>
      <b>{node.kindString}</b>
    </p>
  </Callout>
);
