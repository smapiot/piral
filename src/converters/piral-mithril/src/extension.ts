import { m } from 'mithril';

export function createExtension(rootName: string) {
  return {
    oncreate(vnode) {
      vnode.dom.dispatchEvent(
        new CustomEvent('render-html', {
          bubbles: true,
          detail: {
            target: vnode.dom,
            props: vnode.attrs,
          },
        }),
      );
    },
    view() {
      return m(rootName);
    },
  };
}
