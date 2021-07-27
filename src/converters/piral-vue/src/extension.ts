import type { ExtensionSlotProps } from 'piral-core';
import type { Component } from 'vue';
import { register } from './mount';

export function createExtension(rootName: string, selector: string): Component<ExtensionSlotProps> {
  const VueExtension: Component<ExtensionSlotProps> = {
    functional: false,
    props: ['name', 'empty', 'render', 'params'],
    inject: ['piral'],
    render(createElement) {
      return createElement(rootName);
    },
    mounted() {
      this.piral.renderHtmlExtension(this.$el, {
        empty: this.empty,
        params: this.params,
        render: this.render,
        name: this.name,
      });
    },
  };

  register(selector, VueExtension);
  return VueExtension;
}
