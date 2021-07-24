import type { ExtensionSlotProps } from 'piral-core';
import { Component, h } from 'vue';

export function createExtension(rootName = 'slot'): Component<ExtensionSlotProps> {
  const Vue3Extension: Component<ExtensionSlotProps> = {
    functional: false,
    props: ['name', 'empty', 'render', 'params'],
    inject: ['piral'],
    render() {
      return h(rootName);
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

  return Vue3Extension;
}
