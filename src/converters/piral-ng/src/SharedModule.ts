import * as ngCore from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgExtension } from './NgExtension';
import { ResourceUrlPipe } from './ResourceUrlPipe';

const ngc = ngCore as any;
const declarationsDef = [NgExtension, ResourceUrlPipe];
const exportsDef = [NgExtension, ResourceUrlPipe];
const importsDef = [CommonModule];

@NgModule({
  declarations: declarationsDef,
  providers: [],
  imports: importsDef,
  exports: exportsDef,
})
export class SharedModule {
  static props = {};

  // @ts-ignore
  static ɵfac: ngCore.ɵɵFactoryDeclaration<SharedModule, never> =
    'ɵɵinject' in ngc ? (t: any) => new (t || SharedModule)() : undefined;

  // @ts-ignore
  static ɵmod: ngCore.ɵɵNgModuleDeclaration<
    SharedModule,
    [typeof NgExtension, typeof ResourceUrlPipe],
    [typeof CommonModule],
    [typeof NgExtension, typeof ResourceUrlPipe]
  > =
    'ɵɵdefineNgModule' in ngc
      ? ngc.ɵɵdefineNgModule({
          type: SharedModule,
        })
      : undefined;

  // @ts-ignore
  static ɵinj: ngCore.ɵɵInjectorDeclaration<SharedModule> =
    'ɵɵdefineInjector' in ngc
      ? ngc.ɵɵdefineInjector({
          providers: [],
          imports: [importsDef],
        })
      : undefined;
}

if ('ɵsetClassMetadata' in ngc) {
  ngc.ɵsetClassMetadata(SharedModule, [
    {
      type: NgModule,
      args: [
        {
          declarations: declarationsDef,
          providers: [],
          imports: importsDef,
          exports: exportsDef,
        },
      ],
    },
  ]);
}
