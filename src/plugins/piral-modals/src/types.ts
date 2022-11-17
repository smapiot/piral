import type { ComponentType, ReactNode } from 'react';
import type {
  Dict,
  WrappedComponent,
  BaseComponentProps,
  BaseRegistration,
  Disposable,
  AnyComponent,
  RegistrationDisposer,
} from 'piral-core';

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

  interface PiralCustomRegistryState {
    /**
     * The registered modal dialog components.
     */
    modals: Dict<ModalRegistration>;
  }

  interface PiralCustomErrors {
    modal: ModalErrorInfoProps;
  }

  interface PiralCustomComponentsState {
    /**
     * The host component for modal dialogs.
     */
    ModalsHost: ComponentType<ModalsHostProps>;
    /**
     * The modal dialog component.
     */
    ModalsDialog: ComponentType<ModalsDialogProps>;
  }
}

export interface ModalsHostProps {
  /**
   * Gets if the modal is currently open or closed.
   */
  open: boolean;
  /**
   * Callback to invoke closing the modal dialog.
   */
  close(): void;
  /**
   * The dialogs to display.
   */
  children?: ReactNode;
}

export interface ModalsDialogProps extends OpenModalDialog {
  /**
   * The layout options given for the current dialog.
   */
  layout: ModalLayoutOptions;
  /**
   * The provided default options.
   */
  defaults: any;
  /**
   * The content of the dialog to display.
   */
  children?: ReactNode;
}

/**
 * The options provided for the dialog layout.
 */
export interface ModalLayoutOptions {}

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
  /**
   * The name of the pilet emitting the error.
   */
  pilet?: string;
}

export interface OpenModalDialog {
  /**
   * Gets the ID of the modal to open. For tracking its state.
   */
  id: string;
  /**
   * Specifies the fully qualified name of the dialog to show.
   */
  name: string;
  /**
   * Specifies the alternative (original) name of the dialog to show.
   */
  alternative?: string;
  /**
   * Defines the transported options.
   */
  options: BaseModalOptions;
  /**
   * Closes the modal dialog.
   */
  close(): void;
}

export interface BareModalComponentProps<TOpts> {
  /**
   * Callback for closing the modal programmatically.
   */
  onClose(): void;
  /**
   * Provides the passed in options for this particular modal.
   */
  options?: TOpts;
}

export interface ModalRegistration extends BaseRegistration {
  name: string;
  component: WrappedComponent<ModalComponentProps<any>>;
  defaults: any;
  layout: ModalLayoutOptions;
}

export interface BaseModalOptions {}

export interface PiralCustomModalsMap {}

export interface PiralModalsMap extends PiralCustomModalsMap {}

export type ModalOptions<T> = T extends keyof PiralModalsMap
  ? PiralModalsMap[T] & BaseModalOptions
  : T extends string
  ? BaseModalOptions
  : T;

export type ModalComponentProps<T> = BaseComponentProps & BareModalComponentProps<ModalOptions<T>>;

export interface PiletModalsApi {
  /**
   * Shows a modal dialog with the given name.
   * The modal can be optionally programmatically closed using the returned callback.
   * @param name The name of the registered modal.
   * @param options Optional arguments for creating the modal.
   * @returns A callback to trigger closing the modal.
   */
  showModal<T>(name: T extends string ? T : string, options?: ModalOptions<T>): Disposable;
  /**
   * Registers a modal dialog using a React component.
   * The name needs to be unique to be used without the pilet's name.
   * @param name The name of the modal to register.
   * @param Component The component to render the page.
   * @param defaults Optionally, sets the default values for the inserted options.
   * @param layout Optionally, sets the layout options for the dialog wrapper.
   */
  registerModal<T>(
    name: T extends string ? T : string,
    Component: AnyComponent<ModalComponentProps<T>>,
    defaults?: ModalOptions<T>,
    layout?: ModalLayoutOptions,
  ): RegistrationDisposer;
  /**
   * Unregisters a modal by its name.
   * @param name The name that was previously registered.
   */
  unregisterModal<T>(name: T extends string ? T : string): void;
}
