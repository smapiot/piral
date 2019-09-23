import * as actions from './actions';
import { withApi, buildName, Extend } from 'piral-core';
import { PiletModalsApi } from './types';

/**
 * Creates a new set of Piral API extensions for support modal dialogs.
 */
export function createModalsApi(): Extend<PiletModalsApi> {
  return context => {
    context.defineActions(actions);

    return (api, target) => {
      const prefix = target.name;

      return {
        showModal(name, options) {
          const dialog = {
            name: buildName(prefix, name),
            options,
            close() {
              context.closeModal(dialog);
            },
          };
          context.openModal(dialog);
          return dialog.close;
        },
        registerModal(name, arg, defaults) {
          const id = buildName(prefix, name);
          context.registerModal(id, {
            component: withApi(context.converters, arg, api, 'modal'),
            defaults,
          });
        },
        unregisterModal(name) {
          const id = buildName(prefix, name);
          context.unregisterModal(id);
        },
      };
    };
  };
}
