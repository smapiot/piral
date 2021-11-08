import type { PiletApi } from 'piral-core';
import * as ngCore from '@angular/core';
import { Inject, Pipe, PipeTransform } from '@angular/core';

const ngc = ngCore as any;

@Pipe({ name: 'resourceUrl' })
export class ResourceUrlPipe implements PipeTransform {
  constructor(@Inject('piral') private piral: PiletApi) {}

  transform(value: string): string {
    const { basePath = '/' } = this.piral.meta;
    return basePath + value;
  }

  // @ts-ignore
  static ɵfac: ngCore.ɵɵFactoryDeclaration<ResourceUrlPipe, never> =
    'ɵɵdirectiveInject' in ngc ? (t: any) => new (t || ResourceUrlPipe)(ngc.ɵɵdirectiveInject('piral', 16)) : undefined;

  // @ts-ignore
  static ɵpipe: ngCore.ɵɵPipeDeclaration<ResourceUrlPipe, 'resourceUrl'> =
    'ɵɵdefinePipe' in ngc ? ngc.ɵɵdefinePipe({ name: 'resourceUrl', type: ResourceUrlPipe, pure: true }) : undefined;
}

if ('ɵsetClassMetadata' in ngc) {
  ngc.ɵsetClassMetadata(
    ResourceUrlPipe,
    [
      {
        type: Pipe,
        args: [{ name: 'resourceUrl' }],
      },
    ],
    () => [
      {
        type: undefined,
        decorators: [
          {
            type: Inject,
            args: ['piral'],
          },
        ],
      },
    ],
  );
}
