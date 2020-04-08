import * as actions from './actions';
import { ComponentType } from 'react';
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
 * Available configuration options for the modals plugin.
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
      pilet: undefined,
      name,
      component,
      defaults,
    };
  }

  return modals;
}

/**
 * Creates new Pilet API extensions for support modal dialogs.
 */
export function createModalsApi(config: ModalsConfig = {}): Extend<PiletModalsApi> {
  const { dialogs = [] } = config;

  return context => {
    context.defineActions(actions);

    context.dispatch(state => ({
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
      const pilet = target.name;

      return {
        showModal(name, options) {
          const dialog = {
            name: buildName(pilet, name),
            alternative: name,
            options,
            close() {
              setTimeout(() => context.closeModal(dialog), 0);
            },
          };
          context.openModal(dialog);
          return dialog.close;
        },
        registerModal(name, arg, defaults) {
          const id = buildName(pilet, name);
          context.registerModal(id, {
            pilet,
            name,
            component: withApi(context.converters, arg, api, 'modal'),
            defaults,
          });
        },
        unregisterModal(name) {
          const id = buildName(pilet, name);
          context.unregisterModal(id);
        },
      };
    };
  };
}
