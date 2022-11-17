import * as React from 'react';
import type {} from 'piral-debug-utils';
import type { ExtensionComponentProps, WrappedComponent } from '../types';

function removeAll(nodes: Array<ChildNode>) {
  nodes.forEach((node) => node.remove());
}

interface SlotCarrierProps {
  nodes: Array<ChildNode>;
}

const SlotCarrier: React.FC<SlotCarrierProps> = ({ nodes }) => {
  const host = React.useRef<HTMLSlotElement>();

  React.useEffect(() => {
    host.current?.append(...nodes);
    return () => removeAll(nodes);
  }, [nodes]);

  if (nodes.length) {
    return <piral-slot ref={host} />;
  }

  return null;
};

/**
 * Transforms the given component to an extension component.
 * @param Component The component to transform.
 * @returns The extension component (receiving its props via params).
 */
export function toExtension<T>(Component: React.ComponentType<T>): WrappedComponent<ExtensionComponentProps<T>> {
  return (props) => <Component {...props.params} />;
}

/**
 * Reactifies the list of child nodes to a React Node by removing the
 * nodes from the DOM and carrying it in a React Node, where it would be
 * attached at a slot.
 * @param childNodes The child nodes to reactify.
 * @returns The React Node.
 */
export function reactifyContent(childNodes: NodeListOf<ChildNode>): React.ReactNode {
  const nodes: Array<ChildNode> = Array.prototype.filter.call(childNodes, Boolean);
  removeAll(nodes);
  return <SlotCarrier nodes={nodes} />;
}
