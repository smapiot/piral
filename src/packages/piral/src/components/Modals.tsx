import * as React from 'react';
import { useGlobalState, OpenModalDialog } from 'piral-core';
import { ModalsContainerProps } from '../types';

export interface ModalsCreator {
  ModalsContainer: React.ComponentType<ModalsContainerProps>;
  ModalDialog: React.ComponentType<OpenModalDialog>;
}

export function createModals({ ModalsContainer, ModalDialog }: ModalsCreator): React.SFC {
  return () => {
    const modals = useGlobalState(s => s.app.modals);

    return (
      <ModalsContainer>
        {modals.map(n => (
          <ModalDialog {...n} key={n.name} />
        ))}
      </ModalsContainer>
    );
  };
}
