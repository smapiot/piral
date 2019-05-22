import * as React from 'react';
import { TiNode, TiKind } from './types';
import { TypeRenderer } from './TypeRenderer';
import { SignatureRenderer } from './SignatureRenderer';

export interface TypeLiteralRendererProps {
  node: TiNode;
  render(child: TiNode): JSX.Element;
}

export const TypeLiteralRenderer: React.SFC<TypeLiteralRendererProps> = ({ node, render }) => (
  <ul className="interface-map">
    {(node.children || []).map(child =>
      child.kind === TiKind.Property ? (
        <li key={child.id}>
          {child.comment && child.comment.shortText}
          <span className="block">
            <code>
              {child.name}
              {child.flags && child.flags.isOptional && '?'}: <TypeRenderer node={child.type} render={render} />
            </code>
          </span>
        </li>
      ) : child.kind === TiKind.Method ? (
        <li key={child.id}>
          {child.comment && child.comment.shortText}
          <span className="block">
            <code>
              {child.name}
              {child.flags && child.flags.isOptional && '?'}
              <SignatureRenderer node={child.signatures[0]} render={render} />
            </code>
          </span>
        </li>
      ) : child.kind === TiKind.EnumerationMember ? (
        <li key={child.id}>
          <code>
            {child.name}: <TypeRenderer node={child.type} render={render} />
          </code>{' '}
          ({child.comment && child.comment.shortText})
        </li>
      ) : (
        undefined
      ),
    )}
    {(node.signatures || []).map(
      child =>
        child.kind === TiKind.CallSignature && (
          <li key={child.id}>
            {child.comment && child.comment.shortText}
            <span className="block">
              <code>
                <SignatureRenderer node={child} render={render} />
              </code>
            </span>
          </li>
        ),
    )}
    {(node.indexSignature || []).map(
      child =>
        child.kind === TiKind.IndexSignature && (
          <li key={child.id}>
            {child.comment && child.comment.shortText}
            <span className="block">
              <code>
                <SignatureRenderer node={child} render={render} brackets="[]" />
              </code>
            </span>
          </li>
        ),
    )}
  </ul>
);
