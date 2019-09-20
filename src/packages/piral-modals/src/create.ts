import * as actions from './actions';
import { ApiExtender, GlobalStateContext, withApi, buildName } from 'piral-core';
import { PiletModalsApi } from './types';

export function createModalsApi(context: GlobalStateContext): ApiExtender<PiletModalsApi> {
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
}
