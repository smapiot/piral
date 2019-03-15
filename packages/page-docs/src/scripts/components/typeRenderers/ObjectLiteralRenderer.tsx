import * as React from 'react';
import { TiNode } from './types';
import { Callout } from '../Callout';

export interface ObjectLiteralRendererProps {
  node: TiNode;
}

export const ObjectLiteralRenderer: React.SFC<ObjectLiteralRendererProps> = ({ node }) => (
  <Callout type="danger" title={node.name} icon="puzzle-piece">
    <p>
      <b>{node.kindString}</b>
    </p>
  </Callout>
);
