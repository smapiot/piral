import * as React from 'react';
import { useGlobalState } from 'piral-core';
import { OpenModalDialog } from 'piral-ext';
import { ModalsContainerProps } from '../types';

function closeAll(modals: Array<OpenModalDialog>) {
  modals.forEach(m => m.close());
}

export interface ModalsCreator {
  ModalsContainer: React.ComponentType<ModalsContainerProps>;
  ModalDialog: React.ComponentType<OpenModalDialog>;
}

export function createModals({ ModalsContainer, ModalDialog }: ModalsCreator): React.FC {
  return () => {
    const { dialogs, components } = useGlobalState(s => ({
      dialogs: s.modals,
      components: s.components.modals,
    }));
    const close = () => closeAll(dialogs);
    const children = dialogs
      .map(n => {
        const reg = components[n.name];
        const Component = reg && reg.component;
        const defaults = reg && reg.defaults;
        return (
          Component && (
            <ModalDialog {...n} key={n.name}>
              <Component
                onClose={n.close}
                options={{
                  ...defaults,
                  ...n.options,
                }}
              />
            </ModalDialog>
          )
        );
      })
      .filter(m => !!m);
    const open = children.length > 0;

    return (
      <ModalsContainer open={open} close={close}>
        {children}
      </ModalsContainer>
    );
  };
}
