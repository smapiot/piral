import * as m from 'mithril';
import type { PiletApi } from 'piral-core';

export function createExtension(api: PiletApi, rootName = 'slot') {
  return {
    oncreate(vnode) {
      api.renderHtmlExtension(vnode.dom, vnode.attrs);
    },
    view() {
      return m(rootName);
    },
  };
}
