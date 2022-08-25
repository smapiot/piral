import type { ForeignComponent, BaseComponentProps } from 'piral-core';
import { mountMillion, unmountMillion } from './mount';
import { Extension } from './extension';

export interface MillionConverterOptions {}

export function createConverter(config: MillionConverterOptions = {}) {
  const convert = <TProps extends BaseComponentProps>(root: any): ForeignComponent<TProps> => ({
    mount(el, props) {
      mountMillion(el, root, props);
    },
    unmount(el) {
      unmountMillion(el);
    },
  });
  convert.Extension = Extension;
  return convert;
}
