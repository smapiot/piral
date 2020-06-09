import { ForeignComponent, BaseComponentProps } from 'piral-core';
import { ElmModule } from './types';

export function createConverter() {
  const convert = <TProps extends BaseComponentProps>(
    main: ElmModule<TProps>,
    captured?: Record<string, any>,
  ): ForeignComponent<TProps> => {
    return {
      mount(parent, data, ctx) {
        const node = parent.appendChild(document.createElement('div'));
        parent.addEventListener(
          'render-html',
          (ev: CustomEvent) => {
            const { piral } = data;
            piral.renderHtmlExtension(ev.detail.target, ev.detail.props);
          },
          false,
        );
        main.init({
          node,
          flags: {
            ...captured,
            ...ctx,
            ...data,
          },
        });
      },
      unmount(el) {
        el.innerHTML = '';
      },
    };
  };
  return convert;
}
