import * as React from 'react';
import { TypeParameterRenderer, TypeRenderer } from './TypeRenderer';
import { withSep } from './utils';
import { TiNode } from './types';

export interface SignatureRendererProps {
  node: TiNode;
  render(child: TiNode): JSX.Element;
  brackets?: string;
}

export const SignatureRenderer: React.FC<SignatureRendererProps> = ({ node, render, brackets = '()' }) => (
  <>
    <TypeParameterRenderer args={node.typeParameter} render={render} />
    {brackets[0]}
    {withSep(
      (node.parameters || []).map((p) => (
        <span key={p.id}>
          {p.name}: <TypeRenderer node={p.type} render={render} />
        </span>
      )),
      ', ',
    )}
    {brackets[1]}: <TypeRenderer node={node.type} render={render} />
  </>
);
