import type { ForeignComponent, BaseComponentProps } from 'piral-core';
import { bootstrap, IModule } from 'angular';
import { createExtension } from './extension';

export interface NgjsConverterOptions {
  /**
   * Defines the name of the root element.
   * @default slot
   */
  rootName?: string;
}

export function createConverter(config: NgjsConverterOptions = {}) {
  const { rootName = 'slot' } = config;
  const Extension = createExtension(rootName);
  const convert = <TProps extends BaseComponentProps>(name: string, root: IModule): ForeignComponent<TProps> => {
    let injector: any = undefined;

    return {
      mount(el, props, ctx) {
        el.appendChild(document.createElement(name));
        root.value('props', props);
        root.value('piral', props.piral);
        root.value('ctx', ctx);
        injector = bootstrap(el, [root.name]);
      },
      unmount(el) {
        const rootScope = injector.get('$rootScope');
        rootScope.$destroy();
        injector = undefined;
      },
    };
  };
  convert.Extension = Extension;
  return convert;
}
