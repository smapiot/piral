import { ComponentType } from 'react';
import { OpenModalDialog } from 'piral-core';
import { createModals } from '../../components';
import { ModalsContainerProps, ModalsBuilder } from '../../types';

export interface ModalsBuilderState {
  container: ComponentType<ModalsContainerProps>;
  dialog: ComponentType<OpenModalDialog>;
}

function createInitialState(): ModalsBuilderState {
  return {
    container: undefined,
    dialog: undefined,
  };
}

export function modalsBuilder(state = createInitialState()): ModalsBuilder {
  return {
    container(Component) {
      return modalsBuilder({
        ...state,
        container: Component,
      });
    },
    dialog(Component) {
      return modalsBuilder({
        ...state,
        dialog: Component,
      });
    },
    build() {
      return createModals({
        ModalsContainer: state.container,
        ModalDialog: state.dialog,
      });
    },
  };
}
