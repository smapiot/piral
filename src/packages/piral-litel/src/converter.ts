import { ForeignComponent, BaseComponentProps } from 'piral-core';

export function createConverter() {
  const convert = <TProps extends BaseComponentProps>(elementName: string): ForeignComponent<TProps> => {
    return {
      mount(parent, data, ctx) {
        const { piral } = data as BaseComponentProps;
        const el = parent.appendChild(document.createElement(elementName));
        el.setAttribute('props', JSON.stringify(data));
        el.setAttribute('ctx', JSON.stringify(ctx));
        el.shadowRoot.addEventListener(
          'render-html',
          (ev: CustomEvent) => {
            piral.renderHtmlExtension(ev.detail.target, ev.detail.props);
          },
          false,
        );
      },
      update(parent, data, ctx) {
        const el = parent.querySelector(elementName);

        if (el) {
          el.setAttribute('props', JSON.stringify(data));
          el.setAttribute('ctx', JSON.stringify(ctx));
        }
      },
      unmount(el) {
        el.innerHTML = '';
      },
    };
  };
  return convert;
}
