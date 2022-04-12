import * as React from 'react';
import { useGlobalState } from 'piral-core';
import { PiralModalsDialog, PiralModalsHost } from './components';
import { OpenModalDialog, ModalRegistration } from './types';

function closeAll(modals: Array<OpenModalDialog>) {
  modals.forEach((m) => m.close());
}

function findModal(modals: Record<string, ModalRegistration>, name: string): ModalRegistration {
  if (name) {
    const [modal] = Object.keys(modals)
      .filter((m) => modals[m].name === name)
      .map((m) => modals[m]);

    return modal;
  }

  return undefined;
}

export const Modals: React.FC = () => {
  const modals = useGlobalState((s) => s.registry.modals);
  const dialogs = useGlobalState((s) => s.modals);
  const close = () => closeAll(dialogs);
  const children = dialogs
    .map((n) => {
      const reg = modals[n.name] || findModal(modals, n.alternative);
      const Component = reg && reg.component;
      const defaults = reg && reg.defaults;
      const options = {
        ...defaults,
        ...n.options,
      };
      return (
        Component && (
          <PiralModalsDialog {...n} options={options} defaults={reg.defaults} layout={reg.layout} key={n.name}>
            <Component onClose={n.close} options={options} />
          </PiralModalsDialog>
        )
      );
    })
    .filter(Boolean);
  const open = children.length > 0;

  return (
    <PiralModalsHost open={open} close={close}>
      {children}
    </PiralModalsHost>
  );
};
Modals.displayName = 'Modals';
