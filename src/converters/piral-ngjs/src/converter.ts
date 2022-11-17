import type { ForeignComponent, BaseComponentProps } from 'piral-core';
import { bootstrap, IModule } from 'angular';
import { createExtension } from './extension';

export interface NgjsConverterOptions {
  /**
   * Defines the name of the root element.
   * @default piral-slot
   */
  rootName?: string;
}

interface NgjsState {
  injector: any;
}

export function createConverter(config: NgjsConverterOptions = {}) {
  const { rootName = 'piral-slot' } = config;
  const Extension = createExtension(rootName);
  const convert = <TProps extends BaseComponentProps>(name: string, root: IModule): ForeignComponent<TProps> => ({
    mount(el, props, ctx, locals: NgjsState) {
      el.appendChild(document.createElement(name));
      root.value('props', props);
      root.value('piral', props.piral);
      root.value('ctx', ctx);
      locals.injector = bootstrap(el, [root.name]);
    },
    unmount(el, locals: NgjsState) {
      const rootScope = locals.injector.get('$rootScope');
      rootScope.$destroy();
      locals.injector = undefined;
    },
  });
  convert.Extension = Extension;
  return convert;
}
