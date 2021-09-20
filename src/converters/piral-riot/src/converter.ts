import * as Riot from 'riot';
import { ForeignComponent, BaseComponentProps } from 'piral-core';

export function createConverter() {
  const convert = <TProps extends BaseComponentProps>(
    component: Riot.RiotComponentShell<TProps>,
    captured?: Record<string, any>,
  ): ForeignComponent<TProps> => {
    const mountApp = Riot.component(component);
    let app: Riot.RiotComponent<TProps> = undefined;

    return {
      mount(el, props, ctx) {
        app = mountApp(el, {
          ...captured,
          ...ctx,
          ...props,
        });
      },
      unmount(el) {
        app.unmount(true);
        el.innerHTML = '';
        app = undefined;
      },
    };
  };
  return convert;
}
