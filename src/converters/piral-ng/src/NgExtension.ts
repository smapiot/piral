import type { PiletApi } from 'piral-core';
import * as ngCore from '@angular/core';
import { Component, ElementRef, Input, Inject } from '@angular/core';
import { getMinVersion } from './utils';

const ngc = ngCore as any;
const version = getMinVersion();

@Component({
  selector: 'extension-component',
  template: '',
})
export class NgExtension {
  @Input('name') public name: string | undefined;
  @Input('params') public params: object | undefined;

  constructor(private elRef: ElementRef<HTMLElement>, @Inject('piral') private piral: PiletApi) {}

  ngAfterContentInit() {
    this.piral.renderHtmlExtension(this.elRef.nativeElement, {
      name: this.name,
      params: this.params,
    });
  }

  static ɵfac = undefined;
  static ɵcmp = undefined;
}

if ('ɵɵngDeclareFactory' in ngc) {
  NgExtension.ɵfac = ngc.ɵɵngDeclareFactory({
    minVersion: version,
    version,
    ngImport: ngc,
    type: NgExtension,
    deps: [{ token: ElementRef }, { token: 'piral' }],
    target: ngc.ɵɵFactoryTarget.Component,
  });
}

if ('ɵɵngDeclareComponent' in ngc) {
  NgExtension.ɵcmp = ngc.ɵɵngDeclareComponent({
    minVersion: version,
    version,
    type: NgExtension,
    selector: 'extension-component',
    inputs: { name: 'name', params: 'params' },
    ngImport: ngc,
    template: '',
    isInline: true,
  });
}

if ('ɵɵngDeclareClassMetadata' in ngc) {
  ngc.ɵɵngDeclareClassMetadata({
    minVersion: version,
    version,
    ngImport: ngc,
    type: NgExtension,
    decorators: [
      {
        type: Component,
        args: [
          {
            selector: 'extension-component',
            template: '',
          },
        ],
      },
    ],
    ctorParameters() {
      return [
        { type: ElementRef },
        {
          type: undefined,
          decorators: [
            {
              type: Inject,
              args: ['piral'],
            },
          ],
        },
      ];
    },
    propDecorators: {
      name: [
        {
          type: Input,
          args: ['name'],
        },
      ],
      params: [
        {
          type: Input,
          args: ['params'],
        },
      ],
    },
  });
}
