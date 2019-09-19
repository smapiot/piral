import { PiletApi, PiletMetadata, GlobalStateContext, withApi, buildName } from 'piral-core';
import { PiletModalsApi } from './types';

export function createModalsApi(api: PiletApi, target: PiletMetadata, context: GlobalStateContext): PiletModalsApi {
  return {
    showModal(name, options) {
      const dialog = {
        name: buildName(target.name, name),
        options,
        close() {
          context.closeModal(dialog);
        },
      };
      context.openModal(dialog);
      return dialog.close;
    },
    registerModal(name, arg, defaults) {
      const id = buildName(target.name, name);
      context.registerModal(id, {
        component: withApi(arg, api, 'modal'),
        defaults,
      });
    },
    unregisterModal(name) {
      const id = buildName(target.name, name);
      context.unregisterModal(id);
    },
  };
}
