function hasNode(records: Array<MutationRecord>, node: Node) {
  for (const record of records) {
    const nodes = record.removedNodes;

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i] === node) {
        return true;
      }
    }
  }

  return false;
}

export function whenRemoved(node: Node, cb: () => void) {
  const mo = new MutationObserver(e => hasNode(e, node) && cb());

  mo.observe(node.parentNode, {
    childList: true,
  });
}
