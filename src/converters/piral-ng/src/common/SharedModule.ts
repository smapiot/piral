import { CommonModule } from '@angular/common';
import { NgModule, ɵɵFactoryDeclaration, ɵɵInjectorDeclaration, ɵɵNgModuleDeclaration } from '@angular/core';
import { NgExtension } from './NgExtension';
import { ResourceUrlPipe } from './ResourceUrlPipe';

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

  static ɵfac: ɵɵFactoryDeclaration<SharedModule, never>;

  static ɵmod: ɵɵNgModuleDeclaration<
    SharedModule,
    [typeof NgExtension, typeof ResourceUrlPipe],
    [typeof CommonModule],
    [typeof NgExtension, typeof ResourceUrlPipe]
  >;

  static ɵinj: ɵɵInjectorDeclaration<SharedModule>;
}
