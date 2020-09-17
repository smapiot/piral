import * as React from 'react';
import { Details } from './Details';
import { TiNode, TiKind } from './types';

export interface ObjectLiteralRendererProps {
  node: TiNode;
  render(child: TiNode): JSX.Element;
}

export const ObjectLiteralRenderer: React.FC<ObjectLiteralRendererProps> = ({ node }) => (
  <Details color="red" kind={node.kindString} description={node.comment} title={node.name}>
    <ul className="interface-map">
      {node.children.map(
        (child) =>
          child.kind === TiKind.Variable && (
            <li key={child.id}>
              <code>
                {child.name}: {child.defaultValue}
              </code>
            </li>
          ),
      )}
    </ul>
  </Details>
);
