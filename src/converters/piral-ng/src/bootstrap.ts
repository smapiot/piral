import type { BaseComponentProps, ComponentContext, Disposable, PiletApi } from 'piral-core';
import { startup } from './startup';
import { getAnnotations } from './utils';
import { createModuleInstance, getModuleInstance, getModuleRef } from './module';
import { NgModuleDefiner, PrepareBootstrapResult } from './types';

export function prepareBootstrap(
  piral: PiletApi,
  moduleOrComponent: any,
  moduleRef: string,
  defineModule: NgModuleDefiner,
): PrepareBootstrapResult {
  const [annotation] = getAnnotations(moduleOrComponent);

  if (annotation && annotation.bootstrap) {
    // usually contains things like imports, exports, declarations, ...
    const [component] = annotation.bootstrap;
    annotation.exports = [component];
    const newModuleRef = defineModule(piral, moduleOrComponent);
    return [...getModuleInstance(newModuleRef), component];
  } else {
    // usually contains things like selector, template or templateUrl, changeDetection, ...
    return [
      ...(getModuleInstance(moduleRef || getModuleRef(moduleOrComponent)) ||
        createModuleInstance(piral, moduleOrComponent, defineModule)),
      moduleOrComponent,
    ];
  }
}

export async function bootstrap<TProps extends BaseComponentProps>(
  result: PrepareBootstrapResult,
  node: HTMLElement,
  props: TProps,
  context: ComponentContext,
): Promise<Disposable> {
  const [selectedModule, ngOptions, component] = result;
  const ref = await startup(selectedModule, context, props, ngOptions);

  if (ref) {
    ref.instance.attach(component, node);
    return () => ref.instance.detach(component, node);
  }

  return () => {};
}
