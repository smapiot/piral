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
    watch: {
      params(newValue, oldValue) {
        if (newValue !== oldValue) {
          const newKeys = Object.keys(newValue);
          const oldKeys = Object.keys(oldValue);

          if (newKeys.length === oldKeys.length) {
            let changed = false;

            for (const key of newKeys) {
              if (!oldKeys.includes(key) || newValue[key] !== oldValue[key]) {
                changed = true;
                break;
              }
            }

            if (!changed) {
              return;
            }
          }

          const ev = new CustomEvent('extension-props-changed', {
            detail: {
              empty: this.empty,
              params: newValue,
              render: this.render,
              name: this.name,
            },
          });
          this.$el.dispatchEvent(ev);
        }
      },
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
