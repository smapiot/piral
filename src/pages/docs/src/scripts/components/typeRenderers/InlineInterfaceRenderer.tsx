import * as React from 'react';
import { TypeLiteralRenderer } from './TypeLiteralRenderer';
import { gid } from './utils';
import { TiNode } from './types';
import { Details } from './Details';

export interface InlineInterfaceRendererProps {
  node: TiNode;
  render(child: TiNode): JSX.Element;
}

export const InlineInterfaceRenderer: React.SFC<InlineInterfaceRendererProps> = ({ node, render }) => (
  <>
    {'{'}
    <TypeLiteralRenderer node={node} render={render} />
    {'}'}
  </>
);
