import { Extend } from 'piral-core';
import { Component, ElementRef, Input } from '@angular/core';
import { enqueue } from './queue';
import { bootstrap } from './bootstrap';
import { PiletNgApi } from './types';

/**
 * Available configuration options for the Angular extension.
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
 * Creates a new set of Piral Angular API extensions.
 */
export function createNgApi(config: NgConfig = {}): Extend<PiletNgApi> {
  let next = ~~(Math.random() * 10000);
  const { rootName = 'slot', selectId = () => `ng-${next++}`, selector = 'extension-component' } = config;
  const template = `<${rootName}></${rootName}>`;

  return context => {
    context.converters.ng = ({ component }) => {
      const id = selectId();
      return (el, props, ctx) => {
        enqueue(() => bootstrap(ctx, props, component, el, id));
      };
    };

    return api => {
      @Component({
        selector,
        template,
      })
      class NgExtension {
        @Input('name') public name: string;
        @Input('params') public params: object;

        constructor(private elRef: ElementRef<HTMLElement>) {}

        ngAfterContentInit() {
          api.renderHtmlExtension(this.elRef.nativeElement, {
            name: this.name,
            params: this.params,
          });
        }
      }

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
  };
}
