import { Extend } from 'piral-core';
import { Component, ElementRef, Input, NgModuleRef, Inject, enableProdMode } from '@angular/core';
import { enqueue } from './queue';
import { bootstrap } from './bootstrap';
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
export function createNgApi(config: NgConfig = {}): Extend<PiletNgApi> {
  let next = ~~(Math.random() * 10000);
  const { rootName = 'slot', selectId = () => `ng-${next++}`, selector = 'extension-component' } = config;
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

  if (process.env.DEBUG_PILET !== undefined) {
    enableProdMode();
  }

  return context => {
    context.converters.ng = ({ component }) => {
      const id = selectId();
      let result: Promise<void | NgModuleRef<any>> = Promise.resolve();

      return {
        mount(el, props, ctx) {
          result = enqueue(() => bootstrap(ctx, props, component, el, id));
        },
        unmount(el) {
          result.then(ngMod => ngMod && ngMod.destroy());
        },
      };
    };

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
