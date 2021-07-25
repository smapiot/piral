import { NgModule, NgModuleRef, NgZone, Provider, VERSION } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BaseComponentProps } from 'piral-core';

function getVersionHandler(versions: Record<string, () => void>) {
  const version = `v${VERSION.major || VERSION.full.split('.')[0]}`;
  return versions[version];
}

function sanatize(id: string) {
  return id.replace(/\W/g, '_');
}

function getPlatformProps(context: any, props: any) {
  return [
    { provide: 'Props', useValue: props },
    { provide: 'Context', useValue: context },
  ];
}

function getAnnotations(component: any) {
  let annotations = component?.__annotations__;

  if (!annotations && typeof Reflect !== 'undefined' && 'getOwnMetadata' in Reflect) {
    annotations = (Reflect as any).getOwnMetadata('annotations', component);
  }

  return annotations || [];
}

function setComponentSelector(component: any, id: string) {
  const annotations = getAnnotations(component);
  const annotation = annotations[0];

  if (annotation && !annotation.selector) {
    annotation.selector = `#${id}`;
  }
}

function spread<T>(items: Array<T>, more: Array<T> | undefined): Array<T> {
  if (more) {
    items.push(...more);
  }

  return items;
}

function startup<T>(context: any, props: T, BootstrapModule: any, node: HTMLElement) {
  const values = getPlatformProps(context, props);
  const platform = platformBrowserDynamic(values);
  const zoneIdentifier = `piral-ng:${node.id}`;

  // This is a hack, since NgZone doesn't allow you to configure the property that identifies your zone.
  // See:
  // - https://github.com/PlaceMe-SAS/single-spa-angular-cli/issues/33
  // - https://github.com/angular/angular/blob/a14dc2d7a4821a19f20a9547053a5734798f541e/packages/core/src/zone/ng_zone.ts#L144
  // - https://github.com/angular/angular/blob/a14dc2d7a4821a19f20a9547053a5734798f541e/packages/core/src/zone/ng_zone.ts#L257
  // @ts-ignore
  NgZone.isInAngularZone = () => window.Zone.current._properties[zoneIdentifier] === true;

  return platform
    .bootstrapModule(BootstrapModule)
    .catch((err) => console.log(err))
    .then((bootstrapModule) => {
      node.removeAttribute('id');

      if (bootstrapModule) {
        const zone = bootstrapModule.injector.get(NgZone);
        // @ts-ignore
        const z = zone?._inner ?? zone?.inner;

        if (z && '_properties' in z) {
          z._properties[zoneIdentifier] = true;
        }
      }

      return bootstrapModule;
    });
}

export function bootstrap<T extends BaseComponentProps>(
  context: any,
  props: T,
  moduleOrComponent: any,
  node: HTMLElement,
  id: string,
  moduleOptions: Omit<NgModule, 'boostrap'>,
) {
  const annotations = getAnnotations(moduleOrComponent);
  const annotation = annotations[0];

  if (annotation && annotation.bootstrap) {
    // usually contains things like imports, exports, declarations, ...
    return bootstrapModule(context, props, moduleOrComponent, node, id);
  } else {
    // usually contains things like selector, template or templateUrl, changeDetection, ...
    return bootstrapComponent(context, props, moduleOrComponent, node, id, moduleOptions);
  }
}

export function bootstrapComponent<T extends BaseComponentProps>(
  context: any,
  props: T,
  component: any,
  node: HTMLElement,
  id: string,
  moduleOptions: Omit<NgModule, 'boostrap'>,
): Promise<void | NgModuleRef<any>> {
  const { piral } = props;
  const piralProvider: Provider = {
    provide: 'piral',
    useValue: piral,
  };
  node.id = sanatize(id);
  setComponentSelector(component, node.id);

  @NgModule({
    ...moduleOptions,
    imports: spread([BrowserModule], moduleOptions.imports),
    providers: spread([piralProvider], moduleOptions.providers),
    declarations: spread([component, piral.NgExtension], moduleOptions.declarations),
    bootstrap: [component],
  })
  class BootstrapModule {
    constructor() {}
  }

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
  const annotations = getAnnotations(BootstrapModule);
  const annotation = annotations[0];
  node.id = sanatize(id);

  if (annotation) {
    const providers = annotation.providers || [];
    const declarations = annotation.declarations || [];
    const [component] = annotation.bootstrap || [];
    annotation.providers = [
      ...providers,
      {
        provide: 'piral',
        useValue: piral,
      },
    ];
    annotation.declarations = [...declarations, piral.NgExtension];

    if (component) {
      setComponentSelector(component, node.id);
      annotation.bootstrap = [component];
    }
  }

  return startup(context, props, BootstrapModule, node);
}

if (process.env.NODE_ENV !== 'production') {
  // May be used later for something useful. Right now only debugging output.
  const versionHandlers = {
    legacy() {
      console.log('Running in legacy mode (Angular 2, Angular 4)');
    },
    outdated() {
      console.log('Running in outdated mode (Angular 5-8)');
    },
    current() {
      console.log('Running in current mode (Angular 9-11)');
    },
    next() {
      console.log('Running in next mode (Angular 12)');
    },
    unknown() {
      console.log('Running with an unknown version of Angular');
    },
  };
  const versions = {
    v2: versionHandlers.legacy,
    v4: versionHandlers.legacy,
    v5: versionHandlers.outdated,
    v6: versionHandlers.outdated,
    v7: versionHandlers.outdated,
    v8: versionHandlers.outdated,
    v9: versionHandlers.current,
    v10: versionHandlers.current,
    v11: versionHandlers.current,
    v12: versionHandlers.next,
  };

  const handler = getVersionHandler(versions) || versionHandlers.unknown;
  handler();
}
