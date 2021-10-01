import type { PiletApi } from 'piral-core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ApplicationRef, ComponentFactoryResolver, ComponentRef, NgModule, NgZone } from '@angular/core';
import { RoutingService } from './RoutingService';
import { ResourceUrlPipe } from './ResourceUrlPipe';
import { addImportRecursively, getAnnotations } from './utils';
import { NgOptions, NgModuleDefiner, ModuleInstanceResult } from './types';

interface ModuleDefinition {
  id: string;
  piral: PiletApi;
  active: any;
  module: any;
  components: Array<any>;
  SharedModule: any;
  opts: NgOptions;
}

const availableModules: Array<ModuleDefinition> = [];

function instantiateModule(moduleDef: ModuleDefinition) {
  const { SharedModule, module, components } = moduleDef;
  const imports = [BrowserModule, SharedModule, module];

  addImportRecursively(module, SharedModule);

  @NgModule({
    imports,
    entryComponents: components,
    providers: [RoutingService],
  })
  class BootstrapModule {
    private appRef: ApplicationRef;
    private refs: Array<[any, HTMLElement, ComponentRef<any>]> = [];

    constructor(private resolver: ComponentFactoryResolver, private zone: NgZone, public routing: RoutingService) {}

    ngDoBootstrap(appRef: ApplicationRef) {
      this.appRef = appRef;
    }

    attach(component: any, node: HTMLElement) {
      const factory = this.resolver.resolveComponentFactory(component);

      if (factory) {
        const ref = this.zone.run(() => this.appRef.bootstrap<any>(factory, node));
        this.refs.push([component, node, ref]);
        return ref;
      }
    }

    detach(component: any, node: HTMLElement) {
      for (let i = this.refs.length; i--; ) {
        const item = this.refs[i];

        if (item[0] === component && item[1] === node) {
          item[2].destroy();
          this.refs.splice(i, 1);
        }
      }

      //ngMod && !ngMod._destroyed && ngMod.destroy()
    }
  }

  return BootstrapModule;
}

export function getModuleRef(component: any) {
  const [moduleDef] = availableModules.filter((m) => m.components.includes(component)).map((m) => m.id);
  return moduleDef;
}

export function getModuleInstance(moduleRef: string): ModuleInstanceResult {
  const moduleDef = availableModules.find((s) => s.id === moduleRef);

  if (moduleDef) {
    if (!moduleDef.active) {
      moduleDef.active = instantiateModule(moduleDef);
    }

    return [moduleDef.active, moduleDef.opts];
  }

  return undefined;
}

export function createModuleInstance(
  piral: PiletApi,
  component: any,
  defineModule: NgModuleDefiner,
): ModuleInstanceResult {
  @NgModule({
    declarations: [component],
    imports: [CommonModule],
    exports: [component],
  })
  class Module {}

  const moduleRef = defineModule(piral, Module);
  return getModuleInstance(moduleRef);
}

export function createSharedModule(NgExtension: any): any {
  @NgModule({
    declarations: [NgExtension, ResourceUrlPipe],
    imports: [CommonModule],
    exports: [NgExtension, ResourceUrlPipe],
  })
  class SharedModule {}

  return SharedModule;
}

export function createDefineModule(SharedModule: any) {
  return (piral: PiletApi, module: any, opts: NgOptions = undefined) => {
    const name = piral.meta.name || '';
    const id = name + Math.floor((availableModules.length + Math.random()) * 1234567890).toString(36);
    const [annotation] = getAnnotations(module);
    availableModules.push({
      id,
      SharedModule,
      active: undefined,
      components: annotation.exports || [],
      module,
      piral,
      opts,
    });
    return id;
  };
}
