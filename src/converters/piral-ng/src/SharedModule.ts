import * as ngCore from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgExtension } from './NgExtension';
import { ResourceUrlPipe } from './ResourceUrlPipe';
import { getMinVersion } from './utils';

const ngc = ngCore as any;
const version = getMinVersion();
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

  static ɵfac = undefined;

  static ɵmod = undefined;

  static ɵinj = undefined;
}

if ('ɵɵngDeclareFactory' in ngc) {
  SharedModule.ɵfac = ngc.ɵɵngDeclareFactory({
    minVersion: version,
    version,
    ngImport: ngc,
    type: SharedModule,
    deps: [],
    target: ngc.ɵɵFactoryTarget.NgModule,
  });
}

if ('ɵɵngDeclareNgModule' in ngc) {
  SharedModule.ɵmod = ngc.ɵɵngDeclareNgModule({
    minVersion: version,
    version,
    ngImport: ngc,
    type: SharedModule,
    declarations: declarationsDef,
    imports: importsDef,
    exports: exportsDef,
  });
}

if ('ɵɵngDeclareInjector' in ngc) {
  SharedModule.ɵinj = ngc.ɵɵngDeclareInjector({
    minVersion: version,
    version,
    ngImport: ngc,
    type: SharedModule,
    providers: [],
    imports: [importsDef],
  });
}

if ('ɵɵngDeclareClassMetadata' in ngc) {
  ngc.ɵɵngDeclareClassMetadata({
    minVersion: version,
    version,
    ngImport: ngc,
    type: SharedModule,
    decorators: [
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
    ],
  });
}
