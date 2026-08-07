import type { ForeignComponent, BaseComponentProps } from 'piral-core';
import type { GeaComponentType } from './types';
import { mountGea, unmountGea, type GeaLocals } from './mount';
import { createExtension } from './extension';

export interface GeaConverterOptions {
  /**
   * Defines the name of the root element.
   * @default piral-slot
   */
  rootName?: string;
}

export interface GeaConverter {
  <TProps extends BaseComponentProps>(root: GeaComponentType<TProps>): ForeignComponent<TProps>;
  Extension: any;
}

export function createConverter(config: GeaConverterOptions = {}): GeaConverter {
  const { rootName = 'piral-slot' } = config;
  const Extension = createExtension(rootName);
  const convert = (<TProps extends BaseComponentProps>(root: GeaComponentType<TProps>): ForeignComponent<TProps> => ({
    mount(el, props, ctx, locals: GeaLocals<TProps>) {
      mountGea(el, root, props, ctx, locals);
    },
    update(el, props, ctx, locals: GeaLocals<TProps>) {
      mountGea(el, root, props, ctx, locals);
    },
    unmount(_el, locals: GeaLocals<TProps>) {
      unmountGea(locals);
    },
  })) as GeaConverter;
  convert.Extension = Extension;
  return convert;
}
