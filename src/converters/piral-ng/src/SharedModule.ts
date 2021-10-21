import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgExtension } from './extension';
import { ResourceUrlPipe } from './ResourceUrlPipe';

@NgModule({
  declarations: [NgExtension, ResourceUrlPipe],
  providers: [],
  imports: [CommonModule],
  exports: [NgExtension, ResourceUrlPipe],
})
export class SharedModule {
  static props = {};
}
