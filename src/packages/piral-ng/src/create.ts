import { Extend, ExtensionSlotProps } from 'piral-core';
import { Component, ElementRef } from '@angular/core';
import { PiletNgApi } from './types';
import { enqueue } from './queue';
import { bootstrap } from './bootstrap';

function getPlatformProps(context: any, props: any) {
  return [{ provide: 'Props', useValue: props }, { provide: 'Context', useValue: context }];
}

/**
 * Creates a new set of Piral Angular API extensions.
 */
export function createNgApi(): Extend<PiletNgApi> {
  let next = ~~(Math.random() * 10000);
  return context => {
    context.converters.ng = component => {
      const id = `ng-${next++}`;
      return (el, props, ctx) => {
        enqueue(() => bootstrap(getPlatformProps(ctx, props), component, el, id));
      };
    };
    return api => ({
      getNgExtension(name) {
        const render = api.getHtmlExtension(name);
        @Component({
          selector: 'extension-component',
          template: '<div></div>',
        })
        class ExtensionComponent {
          constructor(private elRef: ElementRef<HTMLElement>, private props: ExtensionSlotProps) {}

          ngAfterContentInit() {
            render(this.elRef.nativeElement, this.props, {});
          }
        }

        return ExtensionComponent;
      },
    });
  };
}
