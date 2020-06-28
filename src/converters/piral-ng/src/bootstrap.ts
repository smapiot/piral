import { NgModule, NgModuleRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BaseComponentProps } from 'piral-core';

function sanatize(id: string) {
  return id.replace(/\W/g, '_');
}

function getPlatformProps(context: any, props: any) {
  return [
    { provide: 'Props', useValue: props },
    { provide: 'Context', useValue: context },
  ];
}

function setComponentSelector(component: any, id: string) {
  const annotations = component && component.__annotations__;
  const annotation = annotations?.[0];

  if (annotation && !annotation.selector) {
    annotation.selector = `#${id}`;
  }
}

function startup<T>(context: any, props: T, BootstrapModule: any, node: HTMLElement) {
  const values = getPlatformProps(context, props);
  const platform = platformBrowserDynamic(values);

  return platform
    .bootstrapModule(BootstrapModule)
    .catch(err => console.log(err))
    .then(bootstrapModule => {
      node.removeAttribute('id');
      return bootstrapModule;
    });
}

export function bootstrap<T extends BaseComponentProps>(
  context: any,
  props: T,
  moduleOrComponent: any,
  node: HTMLElement,
  id: string,) {
  const annotations = moduleOrComponent.__annotations__;
  const annotation = annotations?.[0];

  if (annotation && annotation.bootstrap) {
    // usually contains things like imports, exports, declarations, ...
    return bootstrapModule(context, props, moduleOrComponent, node, id);
  } else {
    // usually contains things like selector, template or templateUrl, changeDetection, ...
    return bootstrapComponent(context, props, moduleOrComponent, node, id);
  }
}

export function bootstrapComponent<T extends BaseComponentProps>(
  context: any,
  props: T,
  component: any,
  node: HTMLElement,
  id: string,
): Promise<void | NgModuleRef<any>> {
  const { piral } = props;
  const declarations = [component, piral.NgExtension];
  node.id = sanatize(id);
  setComponentSelector(component, node.id);

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
  class BootstrapModule { }

  return startup(context, props, BootstrapModule, node);
}

export function bootstrapModule<T extends BaseComponentProps>(
  context: any,
  props: T,
  BootstrapModule: any,
  node: HTMLElement,
  id: string,
): Promise<void | NgModuleRef<any>> {
  const { piral } = props;
  const annotations = BootstrapModule.__annotations__;
  const annotation = annotations?.[0];
  node.id = sanatize(id);

  if (annotation) {
    const providers = annotation.providers || [];
    const declarations = annotation.declarations || [];
    const [component] = annotation.bootstrap || [];
    annotation.providers = [...providers, {
      provide: 'piral',
      useValue: piral,
    }];
    annotation.declarations = [...declarations, piral.NgExtension];

    if (component) {
      setComponentSelector(component, node.id);
      annotation.bootstrap = [component];
    }
  }

  return startup(context, props, BootstrapModule, node);
}
