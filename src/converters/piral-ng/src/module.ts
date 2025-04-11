import type { PiletApi } from 'piral-core';
import type { BehaviorSubject } from 'rxjs';
import type { NgOptions, ModuleInstanceResult, NgModuleFlags } from './types';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  CUSTOM_ELEMENTS_SCHEMA,
  Inject,
  NgModule,
  NgZone,
} from '@angular/core';

import { PIRAL, PROPS } from './injection';
import { teardown } from './startup';
import { RoutingService } from './RoutingService';
import { findComponents, getAnnotations } from './utils';
import { piralName, propsName } from './constants';
import { SharedModule } from '../common';

interface ModuleDefinition {
  active: any;
  module: any;
  components: Array<any>;
  opts: NgOptions;
  flags: NgModuleFlags;
}

const availableModules: Array<ModuleDefinition> = [];

function instantiateModule(moduleDef: ModuleDefinition, piral: PiletApi) {
  const { module, components } = moduleDef;
  const imports = [BrowserModule, SharedModule, module];
  const props = { current: undefined };
  const createProxy = () =>
    new Proxy(props.current, {
      get(_, name) {
        return props.current[name];
      },
    });
  const providers = [
    RoutingService,
    { provide: propsName, useFactory: createProxy, deps: [] },
    { provide: PROPS, useFactory: createProxy, deps: [] },
    { provide: piralName, useFactory: () => piral, deps: [] },
    { provide: PIRAL, useFactory: () => piral, deps: [] },
  ];

  @NgModule({
    imports,
    // @ts-ignore
    entryComponents: components,
    providers,
  })
  class BootstrapModule {
    private appRef: ApplicationRef;
    private refs: Array<[any, HTMLElement, ComponentRef<any>]> = [];

    constructor(
      private resolver: ComponentFactoryResolver,
      private zone: NgZone,
      public routing: RoutingService,
      @Inject('NgFlags') private flags: NgModuleFlags,
    ) {}

    ngDoBootstrap(appRef: ApplicationRef) {
      this.appRef = appRef;
    }

    attach(component: any, node: HTMLElement, $props: BehaviorSubject<any>) {
      const factory = this.resolver.resolveComponentFactory(component);
      props.current = $props.value;

      if (factory) {
        const ref = this.zone.run(() => this.appRef.bootstrap<any>(factory, node));
        const name = (ref.componentType as any)?.ɵcmp?.inputs?.Props;

        if (typeof name === 'string' || Array.isArray(name)) {
          const sub = $props.subscribe((props) => {
            if (typeof ref.setInput === 'function') {
              // Here we don't care about the aliased name etc.
              ref.setInput('Props', props);
            } else if (typeof name === 'string') {
              // Legacy mode - just set it directly and trigger CD
              ref.instance[name] = props;
              ref.changeDetectorRef?.detectChanges();
            }
          });
          ref.onDestroy(() => sub.unsubscribe());
        }

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

      if (!this.flags?.keepAlive && this.refs.length === 0) {
        teardown(BootstrapModule);
      }
    }
  }

  return BootstrapModule;
}

export function activateModuleInstance(moduleDef: ModuleDefinition, piral: PiletApi): ModuleInstanceResult {
  if (!moduleDef.active) {
    moduleDef.active = instantiateModule(moduleDef, piral);
  }

  return [moduleDef.active, moduleDef.opts, moduleDef.flags];
}

export function getModuleInstance(component: any, standalone: boolean, piral: PiletApi) {
  const [moduleDef] = availableModules.filter((m) => m.components.includes(component));

  if (moduleDef) {
    return activateModuleInstance(moduleDef, piral);
  }

  if (process.env.NODE_ENV === 'development') {
    if (!standalone) {
      console.warn(
        'Component not found in all defined Angular modules. Make sure to define (using `defineNgModule`) a module with your component(s) referenced in the exports section of the `@NgModule` decorator.',
        component,
        piral.meta,
      );
    }
  }

  return undefined;
}

export function createModuleInstance(component: any, standalone: boolean, piral: PiletApi): ModuleInstanceResult {
  const declarations = standalone ? [] : [component];
  const importsDef = standalone ? [CommonModule, component] : [CommonModule];
  const exportsDef = [component];
  const schemasDef = [CUSTOM_ELEMENTS_SCHEMA];

  @NgModule({
    declarations,
    imports: importsDef,
    exports: exportsDef,
    schemas: schemasDef,
  })
  class Module {}

  defineModule(Module);
  return getModuleInstance(component, standalone, piral);
}

export function findModule(module: any) {
  return availableModules.find((m) => m.module === module);
}

export function defineModule(module: any, opts: NgOptions = undefined, flags: NgModuleFlags = undefined) {
  const [annotation] = getAnnotations(module);

  if (annotation) {
    availableModules.push({
      active: undefined,
      components: findComponents(annotation.exports),
      module,
      flags,
      opts,
    });
  } else if (typeof module === 'function') {
    const state = {
      current: undefined,
    };

    return (selector: string) => ({
      component: { selector, module, opts, flags, state },
      type: 'ng' as const,
    });
  }
}
