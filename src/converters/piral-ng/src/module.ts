import type { PiletApi } from 'piral-core';
import type { BehaviorSubject } from 'rxjs';
import type { NgOptions, ModuleInstanceResult } from './types';
import * as ngCore from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  NgZone,
} from '@angular/core';
import { RoutingService } from './RoutingService';
import { SharedModule } from './SharedModule';
import { findComponents, getAnnotations } from './utils';

const ngc = ngCore as any;

interface ModuleDefinition {
  active: any;
  module: any;
  components: Array<any>;
  opts: NgOptions;
}

const availableModules: Array<ModuleDefinition> = [];

function instantiateModule(moduleDef: ModuleDefinition, piral: PiletApi) {
  const { module, components } = moduleDef;
  const imports = [BrowserModule, SharedModule, module];
  const props = { current: undefined as BehaviorSubject<any> };
  const providers = [
    RoutingService,
    { provide: 'Props', useFactory: () => props.current.value, deps: [] },
    { provide: 'piral', useFactory: () => piral, deps: [] },
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

    attach(component: any, node: HTMLElement, $props: BehaviorSubject<any>) {
      const factory = this.resolver.resolveComponentFactory(component);
      props.current = $props;

      if (factory) {
        const ref = this.zone.run(() => this.appRef.bootstrap<any>(factory, node));
        const name = (ref.componentType as any)?.ɵcmp?.inputs?.Props;

        if (typeof name === 'string') {
          const sub = $props.subscribe((props) => {
            ref.instance[name] = props;
            ref.changeDetectorRef?.detectChanges();
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
    }

    static ɵfac =
      'ɵɵinject' in ngc
        ? (t: any) =>
            new (t || BootstrapModule)(
              ngc.ɵɵinject(ComponentFactoryResolver),
              ngc.ɵɵinject(NgZone),
              ngc.ɵɵinject(RoutingService),
            )
        : undefined;

    static ɵmod =
      'ɵɵdefineNgModule' in ngc
        ? ngc.ɵɵdefineNgModule({
            type: BootstrapModule,
          })
        : undefined;

    static ɵinj =
      'ɵɵdefineInjector' in ngc
        ? ngc.ɵɵdefineInjector({
            providers,
            imports: [imports],
          })
        : undefined;
  }

  if ('ɵsetClassMetadata' in ngc) {
    ngc.ɵsetClassMetadata(
      BootstrapModule,
      [
        {
          type: NgModule,
          args: [
            {
              entryComponents: components,
              providers,
              imports,
            },
          ],
        },
      ],
      () => [{ type: ComponentFactoryResolver }, { type: NgZone }, { type: RoutingService }],
    );
  }

  return BootstrapModule;
}

export function getModuleInstance(component: any, piral: PiletApi): ModuleInstanceResult {
  const [moduleDef] = availableModules.filter((m) => m.components.includes(component));

  if (moduleDef) {
    if (!moduleDef.active) {
      moduleDef.active = instantiateModule(moduleDef, piral);
    }

    return [moduleDef.active, moduleDef.opts];
  }

  if (process.env.NODE_ENV === 'development') {
    console.warn(
      'Component not found in all defined Angular modules. Make sure to define (using `defineNgModule`) a module with your component(s) referenced in the exports section of the `@NgModule` decorator.',
      component,
      piral.meta,
    );
  }

  return undefined;
}

export function createModuleInstance(component: any, piral: PiletApi): ModuleInstanceResult {
  const declarations = [component];
  const importsDef = [CommonModule];
  const exportsDef = [component];
  const schemasDef = [CUSTOM_ELEMENTS_SCHEMA];

  @NgModule({
    declarations,
    imports: importsDef,
    exports: exportsDef,
    schemas: schemasDef,
  })
  class Module {
    static ɵfac = 'ɵɵinject' in ngc ? (t: any) => new (t || Module)() : undefined;

    static ɵmod =
      'ɵɵdefineNgModule' in ngc
        ? ngc.ɵɵdefineNgModule({
            type: Module,
          })
        : undefined;

    static ɵinj =
      'ɵɵdefineInjector' in ngc
        ? ngc.ɵɵdefineInjector({
            imports: [importsDef],
          })
        : undefined;
  }

  if ('ɵsetClassMetadata' in ngc) {
    ngc.ɵsetClassMetadata(Module, [
      {
        type: NgModule,
        args: [
          {
            declarations,
            imports: importsDef,
            exports: exportsDef,
            schemas: schemasDef,
          },
        ],
      },
    ]);
  }

  defineModule(Module);
  return getModuleInstance(component, piral);
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
