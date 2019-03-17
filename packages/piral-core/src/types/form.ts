import { ComponentType } from 'react';

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
   * Indicats an error while submitting the form
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
   * Gets the current form data, if any.
   */
  formData?: TFormData;
  /**
   * Sets the (partially) updated form data. If no current form data is
   * given this is treated as the initial state.
   * @param data The updated form data.
   */
  setFormData<TKeys extends keyof TFormData>(data: Pick<TFormData, TKeys>): void;
}

export interface FormCreator<TFormData> {
  /**
   * Form function for wrapping a component.
   */
  <TProps>(component: ComponentType<TProps & FormProps<TFormData>>): ComponentType<TProps>;
}

export type PromptMessage = string | (() => string);

export interface InputFormOptions<TFormData> {
  /**
   * If enabled does not notify the user that form data could be lost on page transitions.
   */
  silent?: boolean;
  /**
   * If enabled persists the form until it is submitted or cancelled.
   */
  persist?: boolean;
  /**
   * Allows opening the same form multiple times. By default false.
   */
  multiple?: boolean;
  /**
   * Optionally, overrides the message to show when the form data would be lost.
   */
  message?: PromptMessage;
  /**
   * Callback to be invoked when the form is submitted.
   * In case of an error reject the promise. The error will be handed back to the
   * form.
   */
  onSubmit(data: TFormData): Promise<void>;
}

export interface FormDetails<TFormData> extends InputFormOptions<TFormData> {
  /**
   * The unique ID of the form.
   */
  id: string;
}
