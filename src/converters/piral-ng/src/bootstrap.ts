import type { BaseComponentProps, ComponentContext, Disposable } from 'piral-core';
import type { PrepareBootstrapResult } from './types';
import { startup } from './startup';
import { getAnnotations } from './utils';
import { createModuleInstance, getModuleInstance, defineModule } from './module';

export function prepareBootstrap(moduleOrComponent: any): PrepareBootstrapResult {
  const [annotation] = getAnnotations(moduleOrComponent);

  if (annotation && annotation.bootstrap) {
    // usually contains things like imports, exports, declarations, ...
    const [component] = annotation.bootstrap;
    annotation.exports = [component];
    defineModule(moduleOrComponent);
    return [...getModuleInstance(component), component];
  } else {
    // usually contains things like selector, template or templateUrl, changeDetection, ...
    return [...(getModuleInstance(moduleOrComponent) || createModuleInstance(moduleOrComponent)), moduleOrComponent];
  }
}

export async function bootstrap<TProps extends BaseComponentProps>(
  result: PrepareBootstrapResult,
  node: HTMLElement,
  props: TProps,
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
