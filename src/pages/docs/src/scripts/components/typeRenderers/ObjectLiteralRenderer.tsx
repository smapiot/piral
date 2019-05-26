import * as React from 'react';
import { TiNode, TiKind } from './types';
import { Callout } from '../Callout';

export interface ObjectLiteralRendererProps {
  node: TiNode;
  render(child: TiNode): JSX.Element;
}

export const ObjectLiteralRenderer: React.SFC<ObjectLiteralRendererProps> = ({ node }) => (
  <Callout type="danger" title={node.name} icon="puzzle-piece">
    <p>
      <b>{node.kindString}</b>
    </p>
    <p>{node.comment && node.comment.shortText}</p>
    <ul className="interface-map">
      {node.children.map(
        child =>
          child.kind === TiKind.Variable && (
            <li key={child.id}>
              <code>
                {child.name}: {child.defaultValue}
              </code>
            </li>
          ),
      )}
    </ul>
  </Callout>
);
