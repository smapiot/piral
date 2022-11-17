import type { ComponentType, ReactNode } from 'react';
import type { Dict, GlobalStateContext, PiletEntries } from 'piral-core';

declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends PiletUpdateApi {}

  interface PiralCustomRegistryState {
    /**
     * The registered update abilities from the different pilets.
     */
    updatability: Dict<UpdateModeRegistration>;
  }

  interface PiralCustomState {
    updatability: UpdatabilityState;
  }

  interface PiralCustomActions {
    rejectUpdate(): void;

    approveUpdate(): void;

    checkForUpdates(pilets: PiletEntries): void;

    setUpdateMode(piletName: string, mode: PiletUpdateMode): void;
  }

  interface PiralCustomComponentsState {
    /**
     * The dialog to inform the user about updates for pilets.
     */
    UpdateDialog: ComponentType<UpdateDialogProps>;
  }
}

export interface UpdateModeRegistration {
  mode: PiletUpdateMode;
}

export interface UpdatabilityState {
  active: boolean;
  lastHash: string;
  target: PiletEntries;
}

export interface ListenCallback {
  (notify: (pilets: PiletEntries) => void, context: GlobalStateContext): void;
}

export interface UpdateDialogProps {
  piletsToUpdate: PiletEntries;
  onApprove(): void;
  onReject(): void;
  children?: ReactNode;
}

export type PiletUpdateMode = 'allow' | 'block' | 'ask';

export interface PiletUpdateApi {
  /**
   * Configures the update-ability of the current pilet.
   * @param mode The current update mode of the pilet.
   */
  canUpdate(mode: PiletUpdateMode): void;
}
