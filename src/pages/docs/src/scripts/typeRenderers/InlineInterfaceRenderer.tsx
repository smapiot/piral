import * as React from 'react';
import { TypeLiteralRenderer } from './TypeLiteralRenderer';
import { TiNode } from './types';

export interface InlineInterfaceRendererProps {
  node: TiNode;
  render(child: TiNode): JSX.Element;
}

export const InlineInterfaceRenderer: React.FC<InlineInterfaceRendererProps> = ({ node, render }) => (
  <>
    {'{'}
    <TypeLiteralRenderer node={node} render={render} />
    {'}'}
  </>
);
