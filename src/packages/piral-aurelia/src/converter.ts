import { ForeignComponent, BaseComponentProps } from 'piral-core';
import { Aurelia } from 'aurelia-framework';
import { initialize } from 'aurelia-pal-browser';
import { DefaultLoader } from './DefaultLoader';
import { AureliaModule } from './types';

export function createConverter() {
  initialize();
  const convert = <TProps extends BaseComponentProps>(root: AureliaModule<TProps>): ForeignComponent<TProps> => {
    let aurelia: Aurelia = undefined;

    return {
      mount(el, props, ctx) {
        const { piral } = props;

        aurelia = new Aurelia(new DefaultLoader());

        aurelia.use
          .eventAggregator()
          .history()
          .defaultBindingLanguage()
          .globalResources([piral.AureliaExtension])
          .defaultResources();

        aurelia.container.registerInstance('props', props);
        aurelia.container.registerInstance('ctx', ctx);

        aurelia.start().then(() => aurelia.setRoot(root, el));
      },
      update(_, props, ctx) {
        aurelia.container.registerInstance('props', props);
        aurelia.container.registerInstance('ctx', ctx);
      },
      unmount() {
        aurelia = undefined;
      },
    };
  };
  return convert;
}
