import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

function sanatize(id: string) {
  return id.replace(/\W/g, '_');
}

function getPlatformProps(context: any, props: any) {
  return [{ provide: 'Props', useValue: props }, { provide: 'Context', useValue: context }];
}

export function bootstrap(context: any, props: any, component: any, node: HTMLElement, id: string) {
  const values = getPlatformProps(context, props);
  const platform = platformBrowserDynamic(values);
  const annotations = component && component.__annotations__;
  const annotation = annotations && annotations[0];
  const declarations = [component];
  node.id = sanatize(id);

  if (annotation && !annotation.selector) {
    annotation.selector = `#${node.id}`;
  }

  if (props.piral) {
    declarations.push(props.piral.NgExtension);
  }

  @NgModule({
    imports: [BrowserModule],
    declarations,
    bootstrap: [component],
  })
  class BootstrapModule {}

  return platform
    .bootstrapModule(BootstrapModule)
    .catch(err => console.log(err))
    .then(() => node.removeAttribute('id'));
}
