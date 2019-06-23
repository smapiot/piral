import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

interface PlatformProp {
  provide: string;
  useValue: any;
}

function sanatize(id: string) {
  return id.replace(/\W/g, '_');
}

export function bootstrap(values: Array<PlatformProp>, component: any, node: HTMLElement, id: string) {
  const platform = platformBrowserDynamic(values);
  const annotations = component && component.__annotations__;
  const annotation = annotations && annotations[0];
  node.id = sanatize(id);

  if (annotation && !annotation.selector) {
    annotation.selector = `#${node.id}`;
  }

  @NgModule({
    imports: [BrowserModule],
    declarations: [component],
    bootstrap: [component],
  })
  class BootstrapModule {}

  return platform
    .bootstrapModule(BootstrapModule)
    .catch(err => console.log(err))
    .then(() => node.removeAttribute('id'));
}
