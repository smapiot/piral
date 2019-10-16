import * as React from 'react';
import { useGlobalState } from 'piral-core';
import { PiralModalDialog, PiralModalsHost } from './components';
import { OpenModalDialog } from './types';

function closeAll(modals: Array<OpenModalDialog>) {
  modals.forEach(m => m.close());
}

export const Modals: React.FC = () => {
  const modals = useGlobalState(s => s.registry.modals);
  const dialogs = useGlobalState(s => s.modals);
  const close = () => closeAll(dialogs);
  const children = dialogs
    .map(n => {
      const reg = modals[n.name];
      const Component = reg && reg.component;
      const defaults = reg && reg.defaults;
      return (
        Component && (
          <PiralModalDialog {...n} key={n.name}>
            <Component
              onClose={n.close}
              options={{
                ...defaults,
                ...n.options,
              }}
            />
          </PiralModalDialog>
        )
      );
    })
    .filter(m => !!m);
  const open = children.length > 0;

  return (
    <PiralModalsHost open={open} close={close}>
      {children}
    </PiralModalsHost>
  );
};
Modals.displayName = 'Modals';
