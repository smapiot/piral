import { bootstrap, IModule } from 'angular';
import { ForeignComponent, BaseComponentProps } from 'piral-core';

export function createConverter() {
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
  return convert;
}
