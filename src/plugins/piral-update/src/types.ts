import type { Dict, GlobalStateContext, PiletMetadata } from 'piral-core';
import type { ComponentType } from 'react';

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

    checkForUpdates(pilets: Array<PiletMetadata>): void;

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
  target: Array<PiletMetadata>;
}

export interface ListenCallback {
  (notify: (pilets: Array<PiletMetadata>) => void, context: GlobalStateContext): void;
}

export interface UpdateDialogProps {
  piletsToUpdate: Array<PiletMetadata>;
  onApprove(): void;
  onReject(): void;
}

export type PiletUpdateMode = 'allow' | 'block' | 'ask';

export interface PiletUpdateApi {
  /**
   * Configures the update-ability of the current pilet.
   * @param mode The current update mode of the pilet.
   */
  canUpdate(mode: PiletUpdateMode): void;
}
