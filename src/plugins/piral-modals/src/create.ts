import * as actions from './actions';
import { ComponentType } from 'react';
import { withApi, buildName, PiralPlugin, Dict, withRootExtension, withAll, GlobalState } from 'piral-core';
import { DefaultHost, DefaultDialog } from './default';
import { Modals } from './Modals';
import { PiletModalsApi, ModalRegistration, BareModalComponentProps, ModalLayoutOptions } from './types';

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
  defaults?: any;
  /**
   * The layout options for the modal dialog.
   */
  layout?: ModalLayoutOptions;
}

/**
 * Available configuration options for the modals plugin.
 */
export interface ModalsConfig {
  /**
   * The initial modal dialogs.
   */
  dialogs?: Array<InitialModalDialog>;
  /**
   * Defines how the next ID for the key is selected.
   * By default a random number is used.
   *
   * @param name The name of the modal dialog.
   */
  selectId?(name: string): string;
}

function getModalDialogs(dialogs: Array<InitialModalDialog>) {
  const modals: Dict<ModalRegistration> = {};

  for (const { name, component, defaults, layout = {} } of dialogs) {
    modals[`global-${name}`] = {
      pilet: undefined,
      name,
      component,
      defaults,
      layout,
    };
  }

  return modals;
}

function withModals(modals: Dict<ModalRegistration>) {
  return (state: GlobalState): GlobalState => ({
    ...state,
    components: {
      ModalsHost: DefaultHost,
      ModalsDialog: DefaultDialog,
      ...state.components,
    },
    registry: {
      ...state.registry,
      modals,
    },
    modals: [],
  });
}

/**
 * Creates new Pilet API extensions for support modal dialogs.
 */
export function createModalsApi(config: ModalsConfig = {}): PiralPlugin<PiletModalsApi> {
  const { dialogs = [], selectId = (name) => `${name}-${~~(Math.random() * 10000)}` } = config;

  return (context) => {
    context.defineActions(actions);

    context.dispatch(withAll(withModals(getModalDialogs(dialogs)), withRootExtension('piral-modals', Modals)));

    return (api, target) => {
      const pilet = target.name;

      return {
        showModal(simpleName, options) {
          const name = buildName(pilet, simpleName);
          const dialog = {
            id: selectId(name),
            name,
            alternative: simpleName,
            options,
            close() {
              context.closeModal(dialog);
            },
          };
          context.openModal(dialog);
          return dialog.close;
        },
        registerModal(name, arg, defaults, layout = {}) {
          const id = buildName(pilet, name);
          context.registerModal(id, {
            pilet,
            name,
            component: withApi(context, arg, api, 'modal'),
            defaults,
            layout,
          });
          return () => api.unregisterModal(name);
        },
        unregisterModal(name) {
          const id = buildName(pilet, name);
          context.unregisterModal(id);
        },
      };
    };
  };
}
