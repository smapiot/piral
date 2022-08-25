import { m, VNode, _ } from 'million';
import type { ExtensionSlotProps } from 'piral-core';

function compareObjects(a: any, b: any) {
  for (const i in a) {
    if (!(i in b)) {
      return false;
    }
  }

  for (const i in b) {
    if (!compare(a[i], b[i])) {
      return false;
    }
  }

  return true;
}

function compare<T>(a: T, b: T) {
  if (a !== b) {
    const ta = typeof a;
    const tb = typeof b;

    if (ta === tb && ta === 'object' && a && b) {
      return compareObjects(a, b);
    }

    return false;
  }

  return true;
}

export function createExtension(rootName: string): (props: ExtensionSlotProps) => VNode {
  return (props) => {
    return m(rootName, props, _, _, _, {
      create(node) {
        const { piral } = props as any;
        node.textContent = '';
        node.childNodes.forEach((n) => node.removeChild(n));
        piral.renderHtmlExtension(node, this.props);
        return true;
      },
      update(node, newNode, oldNode) {
        if (!compare((newNode as any).props, (oldNode as any).props)) {
          //TODO render extension
        }
        return true;
      },
    });
  };
}
