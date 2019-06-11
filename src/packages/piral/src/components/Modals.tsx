import * as React from 'react';
import { useGlobalState, OpenModalDialog } from 'piral-core';
import { ModalsContainerProps } from '../types';

function closeAll(modals: Array<OpenModalDialog>) {
  modals.forEach(m => m.close());
}

export interface ModalsCreator {
  ModalsContainer: React.ComponentType<ModalsContainerProps>;
  ModalDialog: React.ComponentType<OpenModalDialog>;
}

export function createModals({ ModalsContainer, ModalDialog }: ModalsCreator): React.SFC {
  return () => {
    const modals = useGlobalState(s => s.app.modals);
    const open = modals.length > 0;
    const close = () => closeAll(modals);

    return (
      <ModalsContainer open={open} close={close}>
        {modals.map(n => (
          <ModalDialog {...n} key={n.name} />
        ))}
      </ModalsContainer>
    );
  };
}
