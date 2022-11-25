import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
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
}
