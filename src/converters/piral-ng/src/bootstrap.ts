import type { BaseComponentProps, ComponentContext, Disposable, PiletApi } from 'piral-core';
import type { BehaviorSubject } from 'rxjs';
import type { PrepareBootstrapResult } from './types';
import { startup } from './startup';
import { getAnnotations } from './utils';
import { createModuleInstance, getModuleInstance, defineModule } from './module';

export function prepareBootstrap(moduleOrComponent: any, piral: PiletApi): PrepareBootstrapResult {
  const [annotation] = getAnnotations(moduleOrComponent);

  // first way is to directly use a module, which is the legacy way
  // second way is to find a previously defined Angular module
  if (annotation && annotation.bootstrap) {
    // usually contains things like imports, exports, declarations, ...
    const [component] = annotation.bootstrap;
    annotation.exports = [component];
    defineModule(moduleOrComponent);
    return [...getModuleInstance(component, piral), component];
  } else {
    // usually contains things like selector, template or templateUrl, changeDetection, ...
    const result = getModuleInstance(moduleOrComponent, piral) || createModuleInstance(moduleOrComponent, piral);
    return [...result, moduleOrComponent];
  }
}

export async function bootstrap<TProps extends BaseComponentProps>(
  result: PrepareBootstrapResult,
  node: HTMLElement,
  props: BehaviorSubject<TProps>,
  context: ComponentContext,
): Promise<Disposable> {
  const [selectedModule, ngOptions, component] = result;
  const ref = await startup(selectedModule, context, ngOptions);

  if (ref) {
    ref.instance.attach(component, node, props);
    return () => ref.instance.detach(component, node);
  }

  return () => {};
}
