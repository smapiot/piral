import 'piral-core';
import { ComponentType, ChangeEvent, FC } from 'react';

declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends PiletFormsApi {}

  interface PiralCustomState {
    /**
     * The relevant state for the active forms.
     */
    forms: FormsState;
  }

  interface PiralCustomActions {
    /**
     * Sets the form data from the provided original state and patch data.
     * @param id The id of the form.
     * @param original The initial state of the form.
     * @param patch The provided patch.
     */
    updateFormState(id: string, original: FormDataState, patch: Partial<FormDataState>): void;
  }

  interface PiralCustomRegistryState {}

  interface PiralCustomErrors {
    form: FormErrorInfoProps;
  }
}

/**
 * The error used when a form submission resulted in an error.
 */
export interface FormErrorInfoProps {
  /**
   * The type of the error.
   */
  type: 'form';
  /**
   * The provided error details.
   */
  error: any;
}

export interface FormDataState {
  /**
   * Gets the usage status of the form - true means
   * the form is actively being used, false is the
   * status for forms that are not used any more.
   */
  active: boolean;
  /**
   * Indicates that the form is currently submitting.
   */
  submitting: boolean;
  /**
   * Stores the potential error of the form.
   */
  error: any;
  /**
   * The initial data to use.
   */
  initialData: any;
  /**
   * The current data that has been submitted.
   */
  currentData: any;
  /**
   * Gets or sets if th current data is different from
   * the initial data.
   */
  changed: boolean;
}

export interface FormsState {
  /**
   * Gets the state of forms that are currently not actively used.
   */
  [id: string]: FormDataState;
}

export interface FormProps<TFormData> {
  /**
   * Submits the current form.
   * @param data The data to submit.
   */
  submit(): void;
  /**
   * Resets the current form.
   */
  reset(): void;
  /**
   * Indicats an error while submitting the form.
   */
  error?: any;
  /**
   * Indicates that the form is currently submitting.
   */
  submitting: boolean;
  /**
   * Gets if the form data has been changed.
   */
  changed: boolean;
  /**
   * Gets the current form data.
   */
  formData: TFormData;
  /**
   * Sets the (partially) updated form data. If no current form data is
   * given this is treated as the initial state.
   * @param data The updated form data.
   */
  setFormData<TKeys extends keyof TFormData>(data: Pick<TFormData, TKeys>): void;
  /**
   * Changes the form field given by the name of the input element that
   * emits the corresponding event.
   * @param e The event arguments.
   */
  changeForm(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void;
}

export interface FormCreator<TFormData, TProps> {
  /**
   * Form function for wrapping a component.
   */
  (component: ComponentType<TProps & FormProps<TFormData>>): FC<TProps>;
}

/**
 * Potential value types for defining a prompt message.
 */
export type PromptMessage = string | (() => string);

export interface InputFormOptions<TFormData, TProps> {
  /**
   * If enabled does not notify the user that form data could be lost on page transitions.
   */
  silent?: boolean;
  /**
   * If enabled forces the user to stay on the form until onSubmit has finished.
   */
  wait?: boolean;
  /**
   * Optionally, overrides the message to show when the form data would be lost.
   */
  message?: PromptMessage;
  /**
   * Loads the initial form data from the provided props, which are the auxiliary props given
   * to the form component.
   */
  loadData?(props: TProps): Promise<TFormData>;
  /**
   * Sets the initial data of the form.
   */
  emptyData: TFormData;
  /**
   * Callback to be invoked when the form is submitted.
   * In case of an error reject the promise. The error will be handed back to the
   * form.
   * @param data The entered form data.
   */
  onSubmit(data: TFormData): Promise<void>;
  /**
   * Callback to be invoked when the form data has changed.
   * Has the ability of changing the form data by returning
   * a promise leading to the modified form data.
   * @param data The currently entered form data.
   */
  onChange?(data: TFormData): Promise<Partial<TFormData>>;
}

export interface PiletFormsApi {
  /**
   * Creates an input form for tracking user input intelligently.
   * @param options The options for creating the form.
   */
  createForm<TFormData, TProps = any>(options: InputFormOptions<TFormData, TProps>): FormCreator<TFormData, TProps>;
}
