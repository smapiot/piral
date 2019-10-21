import * as actions from './actions';
import { ComponentType } from 'react';
import { swap } from '@dbeining/react-atom';
import { withApi, buildName, Extend, Dict } from 'piral-core';
import { DefaultHost, DefaultDialog } from './default';
import { PiletModalsApi, ModalRegistration, BareModalComponentProps } from './types';

export interface InitialModalDialog {
  /**
   * The name of the modal dialog.
   */
  name: string;
  /**
   * The component to show representing the modal dialog.
   */
  component: ComponentType<BareModalComponentProps<any>>;
  /**
   * The default options for the modal dialog.
   */
  defaults: any;
}

/**
 * Available configuration options for the modals extension.
 */
export interface ModalsConfig {
  /**
   * The initial modal dialogs.
   */
  dialogs?: Array<InitialModalDialog>;
}

function getModalDialogs(dialogs: Array<InitialModalDialog>) {
  const modals: Dict<ModalRegistration> = {};

  for (const { name, component, defaults } of dialogs) {
    modals[`global-${name}`] = {
      name,
      component,
      defaults,
    };
  }

  return modals;
}

/**
 * Creates a new set of Piral API extensions for support modal dialogs.
 */
export function createModalsApi(config: ModalsConfig = {}): Extend<PiletModalsApi> {
  const { dialogs = [] } = config;

  return context => {
    context.defineActions(actions);

    swap(context.state, state => ({
      ...state,
      components: {
        ...state.components,
        ModalsHost: DefaultHost,
        ModalsDialog: DefaultDialog,
      },
      registry: {
        ...state.registry,
        modals: getModalDialogs(dialogs),
      },
      modals: [],
    }));

    return (api, target) => {
      const prefix = target.name;

      return {
        showModal(name, options) {
          const dialog = {
            name: buildName(prefix, name),
            alternative: name,
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
            name,
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
