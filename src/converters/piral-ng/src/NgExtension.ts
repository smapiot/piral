import type { PiletApi } from 'piral-core';
import * as ngCore from '@angular/core';
import { Component, ElementRef, Input, Inject, OnChanges } from '@angular/core';

const ngc = ngCore as any;
const selector = 'extension-component';

@Component({
  selector,
  template: '',
})
export class NgExtension implements OnChanges {
  @Input('name') public name: string | undefined;
  @Input('params') public params: object | undefined;

  constructor(private elRef: ElementRef<HTMLElement>, @Inject('piral') private piral: PiletApi) {}

  ngOnChanges() {
    this.elRef.nativeElement.dispatchEvent(
      new CustomEvent('extension-props-changed', {
        detail: {
          name: this.name,
          params: this.params,
        },
      }),
    );
  }

  ngAfterContentInit() {
    this.piral.renderHtmlExtension(this.elRef.nativeElement, {
      name: this.name,
      params: this.params,
    });
  }

  // @ts-ignore
  static ɵfac: ngCore.ɵɵFactoryDeclaration<NgExtension, never> =
    'ɵɵdirectiveInject' in ngc
      ? (t: any) => new (t || NgExtension)(ngc.ɵɵdirectiveInject(ElementRef), ngc.ɵɵdirectiveInject('piral'))
      : undefined;

  // @ts-ignore
  static ɵcmp: ngCore.ɵɵComponentDeclaration<
    NgExtension,
    'extension-component',
    never,
    { name: 'name'; params: 'params' },
    {},
    never,
    never
  > =
    'ɵɵdefineComponent' in ngc
      ? ngc.ɵɵdefineComponent({
          type: NgExtension,
          selectors: [selector],
          inputs: { name: 'name', params: 'params' },
          decls: 0,
          vars: 0,
          template: () => {},
          encapsulation: 2,
        })
      : undefined;
}

if ('ɵsetClassMetadata' in ngc) {
  ngc.ɵsetClassMetadata(NgExtension, [
    {
      type: Component,
      args: [{ selector, template: '' }],
    },
  ]);
}
