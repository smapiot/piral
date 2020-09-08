import { inlineView, customElement, bindable } from 'aurelia-framework';
import type { PiletApi, ExtensionSlotProps } from 'piral-core';
import type { AureliaModule } from './types';

export function createExtension(api: PiletApi, rootName = 'span'): AureliaModule<ExtensionSlotProps> {
  @customElement('extension-component')
  @inlineView(`
    <template>
      <${rootName} ref="host"></${rootName}>
    <template>`)
  class AureliaExtension {
    private host: HTMLElement;
    @bindable() private name: string;
    @bindable() private render: any;
    @bindable() private empty: any;
    @bindable() private params: any;

    attached() {
      api.renderHtmlExtension(this.host, {
        name: this.name,
        render: this.render,
        empty: this.empty,
        params: this.params,
      });
    }
  }

  return AureliaExtension;
}
