import { PiletApi, PiletMetadata, GlobalStateContext, AnyComponent, withApi, buildName, markReact } from 'piral-core';
import { PiletModalsApi, ModalComponentProps } from './types';

function addModal<TOpts>(
  context: GlobalStateContext,
  api: PiletApi,
  id: string,
  arg: AnyComponent<ModalComponentProps<TOpts>>,
  defaults?: TOpts,
) {
  context.registerModal(id, {
    component: withApi(arg, api, 'modal') as any,
    defaults,
  });
}

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
    registerModalX(name, arg, defaults) {
      const id = buildName(target.name, name);
      addModal(context, api, id, arg, defaults);
    },
    registerModal(name, arg, defaults) {
      const id = buildName(target.name, name);
      markReact(arg, `Modal:${name}`);
      addModal(context, api, id, arg, defaults);
    },
    unregisterModal(name) {
      const id = buildName(target.name, name);
      context.unregisterModal(id);
    },
  };
}
