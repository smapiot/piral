import { inlineView, customElement, bindable, inject } from 'aurelia-framework';
import type { ExtensionSlotProps, PiletApi } from 'piral-core';
import type { AureliaModule } from './types';

export function createExtension(rootName: string): AureliaModule<ExtensionSlotProps> {
  @inject('piral')
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

    constructor(private piral: PiletApi) {}

    attached() {
      this.piral.renderHtmlExtension(this.host, {
        name: this.name,
        render: this.render,
        empty: this.empty,
        params: this.params,
      });
    }
  }

  return AureliaExtension;
}
