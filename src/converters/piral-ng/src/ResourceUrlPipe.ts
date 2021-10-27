import type { PiletApi } from 'piral-core';
import * as ngCore from '@angular/core';
import { Inject, Pipe, PipeTransform } from '@angular/core';
import { getMinVersion } from './utils';

const ngc = ngCore as any;
const version = getMinVersion();

@Pipe({ name: 'resourceUrl' })
export class ResourceUrlPipe implements PipeTransform {
  constructor(@Inject('piral') private piral: PiletApi) {}

  transform(value: string): string {
    const { basePath = '/' } = this.piral.meta;
    return basePath + value;
  }

  static ɵfac = undefined;
  static ɵpipe = undefined;
}

if ('ɵɵngDeclareFactory' in ngc) {
  ResourceUrlPipe.ɵfac = ngc.ɵɵngDeclareFactory({
    minVersion: version,
    version,
    ngImport: ngc,
    type: ResourceUrlPipe,
    deps: [{ token: 'piral' }],
    target: ngc.ɵɵFactoryTarget.Pipe,
  });
}

if ('ɵɵngDeclarePipe' in ngc) {
  ResourceUrlPipe.ɵpipe = ngc.ɵɵngDeclarePipe({
    minVersion: version,
    version,
    ngImport: ngc,
    type: ResourceUrlPipe,
    name: 'resourceUrl',
  });
}

if ('ɵɵngDeclareClassMetadata' in ngc) {
  ngc.ɵɵngDeclareClassMetadata({
    minVersion: version,
    version,
    ngImport: ngc,
    type: ResourceUrlPipe,
    decorators: [
      {
        type: Pipe,
        args: [{ name: 'resourceUrl' }],
      },
    ],
    ctorParameters() {
      return [
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
  });
}
