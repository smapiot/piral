import * as React from 'react';

function camelCase(_: string, m: string) {
  return m.toUpperCase();
}

function tuplesToObject<T>(values: Array<[string, T]>): Record<string, T> {
  return values.reduce((prev, curr) => {
    prev[curr[0]] = curr[1];
    return prev;
  }, {});
}

function convertStyle(value: string) {
  return tuplesToObject(
    value.split(';').map(
      (m): [string, string] => {
        const parts = m.trim().split(':');
        const [key, ...val] = parts;
        return [key.trim().replace(/\-([a-z])/g, camelCase), val.join(':').trim()];
      },
    ),
  );
}

function convertAttributes(node: Element) {
  const list = node.attributes;
  const length = list.length;
  const result: Array<[string, any]> = [];

  for (let i = 0; i < length; i++) {
    const entry = list[i];
    let name = entry.name;
    let value: any = entry.value;

    switch (name) {
      case 'for':
        name = 'htmlFor';
        break;
      case 'class':
        name = 'className';
        break;
      case 'selected':
      case 'checked':
        break;
      case 'style':
        value = convertStyle(value);
        break;
      case 'value':
        name = 'defaultValue';
        break;
    }

    result.push([name, value]);
  }

  return tuplesToObject(result);
}

function isElement(node: Node): node is Element {
  return node.nodeType === document.ELEMENT_NODE;
}

function isText(node: Node): node is Text {
  return node.nodeType === document.TEXT_NODE;
}

function populate(nodes: NodeListOf<Node>) {
  const elements: Array<React.ReactChild> = [];
  const length = nodes.length;

  for (let i = 0; i < length; i++) {
    const node = nodes[i];

    if (isElement(node)) {
      const attrs = convertAttributes(node);
      const children = populate(node.childNodes);
      elements.push(React.createElement(node.localName, attrs, ...children));
    } else if (isText(node) && /^\s+$/.test(node.data) === false) {
      elements.push(node.data);
    }
  }

  return elements;
}

export function rehydrate(root: HTMLTemplateElement) {
  if (root && root.content) {
    return populate(root.content.childNodes);
  }

  return [];
}
