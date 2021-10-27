import type { NgOptions, ModuleInstanceResult } from './types';
import * as ngCore from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ApplicationRef, ComponentFactoryResolver, ComponentRef, NgModule, NgZone } from '@angular/core';
import { RoutingService } from './RoutingService';
import { SharedModule } from './SharedModule';
import { findComponents, getAnnotations, getMinVersion } from './utils';

const ngc = ngCore as any;
const version = getMinVersion();

interface ModuleDefinition {
  active: any;
  module: any;
  components: Array<any>;
  opts: NgOptions;
}

const availableModules: Array<ModuleDefinition> = [];

function instantiateModule(moduleDef: ModuleDefinition) {
  const { module, components } = moduleDef;
  const imports = [BrowserModule, SharedModule, module];
  const props = { current: undefined };
  const providers = [
    RoutingService,
    { provide: 'Props', useFactory: () => props.current, deps: [] },
    { provide: 'piral', useFactory: () => props.current.piral, deps: [] },
  ];

  @NgModule({
    imports,
    entryComponents: components,
    providers,
  })
  class BootstrapModule {
    private appRef: ApplicationRef;
    private refs: Array<[any, HTMLElement, ComponentRef<any>]> = [];

    constructor(private resolver: ComponentFactoryResolver, private zone: NgZone, public routing: RoutingService) {}

    ngDoBootstrap(appRef: ApplicationRef) {
      this.appRef = appRef;
    }

    attach(component: any, node: HTMLElement, $props: any) {
      const factory = this.resolver.resolveComponentFactory(component);
      props.current = $props;

      if (factory) {
        const ref = this.zone.run(() => this.appRef.bootstrap<any>(factory, node));
        this.refs.push([component, node, ref]);
      }
    }

    detach(component: any, node: HTMLElement) {
      for (let i = this.refs.length; i--; ) {
        const [sourceComponent, sourceNode, ref] = this.refs[i];

        if (sourceComponent === component && sourceNode === node) {
          ref.destroy();
          this.refs.splice(i, 1);
        }
      }
    }

    static ɵfac = undefined;

    static ɵmod = undefined;

    static ɵinj = undefined;
  }

  if ('ɵɵngDeclareFactory' in ngc) {
    BootstrapModule.ɵfac = ngc.ɵɵngDeclareFactory({
      minVersion: version,
      version,
      ngImport: ngc,
      type: BootstrapModule,
      deps: [{ token: ComponentFactoryResolver }, { token: NgZone }, { token: RoutingService }],
      target: ngc.ɵɵFactoryTarget.NgModule,
    });
  }

  if ('ɵɵngDeclareNgModule' in ngc) {
    BootstrapModule.ɵmod = ngc.ɵɵngDeclareNgModule({
      minVersion: version,
      version,
      ngImport: ngc,
      type: BootstrapModule,
      imports,
    });
  }

  if ('ɵɵngDeclareInjector' in ngc) {
    BootstrapModule.ɵinj = ngc.ɵɵngDeclareInjector({
      minVersion: version,
      version,
      ngImport: ngc,
      type: BootstrapModule,
      providers,
      imports: [imports],
    });
  }

  if ('ɵɵngDeclareClassMetadata' in ngc) {
    ngc.ɵɵngDeclareClassMetadata({
      minVersion: version,
      version,
      ngImport: ngc,
      type: BootstrapModule,
      decorators: [
        {
          type: NgModule,
          args: [
            {
              imports,
              entryComponents: components,
              providers,
            },
          ],
        },
      ],
      ctorParameters() {
        return [{ type: ComponentFactoryResolver }, { type: NgZone }, { type: RoutingService }];
      },
    });
  }

  return BootstrapModule;
}

export function getModuleInstance(component: any): ModuleInstanceResult {
  const [moduleDef] = availableModules.filter((m) => m.components.includes(component));

  if (moduleDef) {
    if (!moduleDef.active) {
      moduleDef.active = instantiateModule(moduleDef);
    }

    return [moduleDef.active, moduleDef.opts];
  }

  return undefined;
}

export function createModuleInstance(component: any): ModuleInstanceResult {
  @NgModule({
    declarations: [component],
    imports: [CommonModule],
    exports: [component],
  })
  class Module {}

  defineModule(Module);
  return getModuleInstance(component);
}

export function defineModule(module: any, opts: NgOptions = undefined) {
  const [annotation] = getAnnotations(module);
  availableModules.push({
    active: undefined,
    components: findComponents(annotation.exports),
    module,
    opts,
  });
}
