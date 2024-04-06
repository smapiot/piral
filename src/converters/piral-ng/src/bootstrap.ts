import type { BaseComponentProps, ComponentContext, Disposable, PiletApi } from 'piral-core';
import type { BehaviorSubject } from 'rxjs';
import type { Type, NgLazyType, PrepareBootstrapResult } from './types';
import { createModuleInstance, getModuleInstance, defineModule, findModule, activateModuleInstance } from './module';
import { getAnnotations, hasSelector } from './utils';
import { startup } from './startup';

export async function prepareBootstrap(
  moduleOrComponent: Type<any> | NgLazyType,
  piral: PiletApi,
): Promise<PrepareBootstrapResult> {
  if ('module' in moduleOrComponent && typeof moduleOrComponent.module === 'function') {
    if (!(moduleOrComponent.state.current instanceof Promise)) {
      moduleOrComponent.state.current = moduleOrComponent.module().then((result) => {
        if (typeof result !== 'object' || !('default' in result)) {
          throw new Error('The lazy loaded module does not `default` export a NgModule class.');
        }

        defineModule(result.default, moduleOrComponent.opts, moduleOrComponent.flags);
        return findModule(result.default);
      });
    }

    const moduleDef = await moduleOrComponent.state.current;
    const { components } = moduleDef;
    const component = components.find((m) => hasSelector(m, moduleOrComponent.selector));

    if (!component) {
      throw new Error(`No component matching the selector "${moduleOrComponent.selector}" has been found.`);
    }

    return [...activateModuleInstance(moduleDef, piral), component];
  } else {
    const [annotation] = getAnnotations(moduleOrComponent);
    const standalone = annotation?.standalone;

    // first way is to directly use a module, which is the legacy way
    // second way is to find a previously defined Angular module
    if (annotation && annotation.bootstrap) {
      // usually contains things like imports, exports, declarations, ...
      const [component] = annotation.bootstrap;
      annotation.exports = [component];
      defineModule(moduleOrComponent);
      return [...getModuleInstance(component, standalone, piral), component];
    } else {
      // usually contains things like selector, template or templateUrl, changeDetection, ...
      const result =
        getModuleInstance(moduleOrComponent, standalone, piral) ||
        createModuleInstance(moduleOrComponent, standalone, piral);
      return [...result, moduleOrComponent];
    }
  }
}

export async function bootstrap<TProps extends BaseComponentProps>(
  result: PrepareBootstrapResult,
  node: HTMLElement,
  props: BehaviorSubject<TProps>,
  context: ComponentContext,
): Promise<Disposable> {
  const [selectedModule, ngOptions, ngFlags, component] = result;
  const ref = await startup(selectedModule, context, ngOptions, ngFlags);

  if (ref) {
    ref.instance.attach(component, node, props);
    return () => ref.instance.detach(component, node);
  }

  return () => {};
}
