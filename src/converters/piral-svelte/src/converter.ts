import { ForeignComponent, BaseComponentProps } from 'piral-core';
import { SvelteComponentInstance, SvelteModule } from './types';

export function createConverter() {
  const convert = <TProps extends BaseComponentProps>(
    Component: SvelteModule<TProps>,
    captured?: Record<string, any>,
  ): ForeignComponent<TProps> => {
    let instance: SvelteComponentInstance<any> = undefined;

    return {
      mount(parent, data, ctx) {
        parent.addEventListener(
          'render-html',
          (ev: CustomEvent) => {
            const { piral } = data;
            piral.renderHtmlExtension(ev.detail.target, ev.detail.props);
          },
          false,
        );
        instance = new Component({
          target: parent,
          props: {
            ...captured,
            ...ctx,
            ...data,
          },
        });
      },
      update(_, data) {
        Object.keys(data).forEach(key => {
          instance[key] = data[key];
        });
      },
      unmount(el) {
        instance.$destroy();
        instance = undefined;
        el.innerHTML = '';
      },
    };
  };
  return convert;
}
