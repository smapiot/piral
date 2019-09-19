import { ComponentType } from 'react';
import { Dict, WrappedComponent, BaseComponentProps, ForeignComponent, Disposable } from 'piral-core';

declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends PiletModalsApi {}

  interface PiralCustomState {
    /**
     * The currently open modal dialogs.
     */
    modals: Array<OpenModalDialog>;
  }

  interface PiralCustomActions {
    /**
     * Opens the provided dialog.
     * @param dialog The dialog to show.
     */
    openModal(dialog: OpenModalDialog): void;
    /**
     * Closes the provided dialog.
     * @param dialog The dialog to hide.
     */
    closeModal(dialog: OpenModalDialog): void;
    /**
     * Registers a new modal dialog.
     * @param name The name of the modal.
     * @param value The modal registration.
     */
    registerModal(name: string, value: ModalRegistration): void;
    /**
     * Unregisters an existing modal dialog.
     * @param name The name of the modal to be removed.
     */
    unregisterModal(name: string): void;
  }

  interface PiralCustomComponentsState {
    /**
     * The registered modal dialog components.
     */
    modals: Dict<ModalRegistration>;
  }

  interface PiralCustomErrors {
    modal: ModalErrorInfoProps;
  }
}

/**
 * The error used when a registered modal dialog crashed.
 */
export interface ModalErrorInfoProps {
  /**
   * The type of the error.
   */
  type: 'modal';
  /**
   * The provided error details.
   */
  error: any;
  /**
   * Callback for closing the modal programmatically.
   */
  onClose(): void;
}

export interface OpenModalDialog {
  name: string;
  options: any;
  close(): void;
}

export interface ModalComponentProps<TOpts> extends BaseComponentProps {
  /**
   * Callback for closing the modal programmatically.
   */
  onClose(): void;
  /**
   * Provides the passed in options for this particular modal.
   */
  options?: TOpts;
}

export interface ModalRegistration {
  component: WrappedComponent<ModalComponentProps<any>>;
  defaults: any;
}

export interface PiletModalsApi {
  /**
   * Shows a modal dialog with the given name.
   * The modal can be optionally programmatically closed using the returned callback.
   * @param name The name of the registered modal.
   * @param options Optional arguments for creating the modal.
   * @returns A callback to trigger closing the modal.
   */
  showModal<TOpts = any>(name: string, options?: TOpts): Disposable;
  /**
   * Registers a modal dialog using a React component.
   * The name needs to be unique to be used without the pilet's name.
   * @param name The name of the modal to register.
   * @param Component The component to render the page.
   * @param defaults Optionally, sets the default values for the inserted options.
   */
  registerModal<TOpts>(name: string, Component: ComponentType<ModalComponentProps<TOpts>>, defaults?: TOpts): void;
  /**
   * Unregisters a modal by its name.
   * @param name The name that was previously registered.
   */
  unregisterModal(name: string): void;
}
