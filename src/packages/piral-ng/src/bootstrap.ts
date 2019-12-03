import { NgModule, NgModuleRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BaseComponentProps } from 'piral-core';

function sanatize(id: string) {
  return id.replace(/\W/g, '_');
}

function getPlatformProps(context: any, props: any) {
  return [{ provide: 'Props', useValue: props }, { provide: 'Context', useValue: context }];
}

export function bootstrap<T extends BaseComponentProps>(
  context: any,
  props: T,
  component: any,
  node: HTMLElement,
  id: string,
): Promise<void | NgModuleRef<any>> {
  const { piral } = props;
  const values = getPlatformProps(context, props);
  const platform = platformBrowserDynamic(values);
  const annotations = component && component.__annotations__;
  const annotation = annotations && annotations[0];
  const declarations = [component];
  node.id = sanatize(id);

  if (annotation && !annotation.selector) {
    annotation.selector = `#${node.id}`;
  }

  declarations.push(piral.NgExtension);

  @NgModule({
    imports: [BrowserModule],
    providers: [
      {
        provide: 'piral',
        useValue: piral,
      },
    ],
    declarations,
    bootstrap: [component],
  })
  class BootstrapModule {}

  return platform
    .bootstrapModule(BootstrapModule)
    .catch(err => console.log(err))
    .then(bootstrapModule => {
      node.removeAttribute('id');
      return bootstrapModule;
    });
}
