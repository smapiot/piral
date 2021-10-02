import type { NgOptions, NgModuleDefiner, ModuleInstanceResult } from './types';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ApplicationRef, ComponentFactoryResolver, ComponentRef, NgModule, NgZone } from '@angular/core';
import { RoutingService } from './RoutingService';
import { ResourceUrlPipe } from './ResourceUrlPipe';
import { addImportRecursively, getAnnotations } from './utils';

interface ModuleDefinition {
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

    attach(component: any, node: HTMLElement, props: any) {
      const factory = this.resolver.resolveComponentFactory(component);
      SharedModule.props = props;

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

export function createModuleInstance(component: any, defineModule: NgModuleDefiner): ModuleInstanceResult {
  @NgModule({
    declarations: [component],
    imports: [CommonModule],
    exports: [component],
  })
  class Module {}

  defineModule(Module);
  return getModuleInstance(component);
}

export function createSharedModule(NgExtension: any): any {
  @NgModule({
    declarations: [NgExtension, ResourceUrlPipe],
    providers: [{ provide: 'Props', useFactory: () => SharedModule.props, deps: [] }],
    imports: [CommonModule],
    exports: [NgExtension, ResourceUrlPipe],
  })
  class SharedModule {
    static props = {};
  }

  return SharedModule;
}

export function createDefineModule(SharedModule: any) {
  return (module: any, opts: NgOptions = undefined) => {
    const [annotation] = getAnnotations(module);
    availableModules.push({
      SharedModule,
      active: undefined,
      components: annotation.exports || [],
      module,
      opts,
    });
  };
}
