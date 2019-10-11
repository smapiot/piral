import { ComponentType } from 'react';
import { OpenModalDialog } from 'piral-ext';
import { createBuilder } from './createBuilder';
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
  const initial = {
    build() {
      return createModals({
        ModalsContainer: state.container,
        ModalDialog: state.dialog,
      });
    },
  } as ModalsBuilder;
  return createBuilder(initial, state, modalsBuilder);
}
