import { PiralPlugin } from 'piral-core';
import { Component, ElementRef, Input, Inject, enableProdMode } from '@angular/core';
import { createConverter } from './converter';
import { PiletNgApi } from './types';

/**
 * Available configuration options for the Angular plugin.
 */
export interface NgConfig {
  /**
   * Defines the name of the extension component.
   * @default extension-component
   */
  selector?: string;
  /**
   * Defines the name of the root element.
   * @default slot
   */
  rootName?: string;
  /**
   * Defines how the next ID for mounting is selected.
   * By default a random number is used in conjunction with a `ng-` prefix.
   */
  selectId?(): string;
}

/**
 * Creates the Pilet API extensions for Angular.
 */
export function createNgApi(config: NgConfig = {}): PiralPlugin<PiletNgApi> {
  const { rootName = 'slot', selector = 'extension-component', selectId } = config;
  const template = `<${rootName}></${rootName}>`;

  @Component({
    selector,
    template,
  })
  class NgExtension {
    @Input('name') public name: string;
    @Input('params') public params: object;

    constructor(private elRef: ElementRef<HTMLElement>, @Inject('piral') private piral: any) {}

    ngAfterContentInit() {
      this.piral.renderHtmlExtension(this.elRef.nativeElement, {
        name: this.name,
        params: this.params,
      });
    }
  }

  if (process.env.ENV === 'production') {
    enableProdMode();
  }

  return context => {
    const convert = createConverter(selectId);
    context.converters.ng = ({ component }) => convert(component);

    return {
      NgExtension,
      fromNg(component) {
        return {
          type: 'ng',
          component,
        };
      },
    };
  };
}
