import { ForeignComponent, BaseComponentProps } from 'piral-core';
import { EmberInstance, EmberModule } from './types';

export function createConverter() {
  const convert = <TProps extends BaseComponentProps>(
    App: EmberModule<TProps>,
    opts: any,
  ): ForeignComponent<TProps> => {
    let app: EmberInstance<TProps> = undefined;

    return {
      mount(rootElement, props, ctx) {
        rootElement.addEventListener(
          'render-html',
          (ev: CustomEvent) => {
            const { piral } = props;
            piral.renderHtmlExtension(ev.detail.target, ev.detail.props);
          },
          false,
        );
        app = App.create({
          ...opts,
          rootElement,
          props,
          ctx,
        });
      },
      update(_, props, ctx) {
        app.setProperties({
          props,
          ctx,
        });
      },
      unmount(rootElement) {
        app.destroy();
        app = undefined;
        rootElement.innerHTML = '';
      },
    };
  };
  return convert;
}
