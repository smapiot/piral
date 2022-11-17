import type { ForeignComponent } from 'piral-core';

declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends PiletSingleSpaApi {}

  interface PiralCustomComponentConverters<TProps> {
    'single-spa'(copmponent: SingleSpaComponent<TProps>): ForeignComponent<TProps>;
  }
}

export interface SingleSpaAppProps {
  name: string;
  singleSpa: any;
  mountParcel(parcelConfig: any, customProps: any): any;
}

export interface SingleSpaLifeCycleFn<TProps> {
  (config: TProps & SingleSpaAppProps): Promise<any>;
}

export interface SingleSpaLifecycle<TProps> {
  bootstrap: SingleSpaLifeCycleFn<TProps> | Array<SingleSpaLifeCycleFn<TProps>>;
  mount: SingleSpaLifeCycleFn<TProps> | Array<SingleSpaLifeCycleFn<TProps>>;
  unmount: SingleSpaLifeCycleFn<TProps> | Array<SingleSpaLifeCycleFn<TProps>>;
  update?: SingleSpaLifeCycleFn<TProps> | Array<SingleSpaLifeCycleFn<TProps>>;
}

export interface SingleSpaComponent<TProps> {
  /**
   * The single-spa lifecycle to expose.
   */
  lifecycle: SingleSpaLifecycle<TProps>;
  /**
   * The type of the single-spa component.
   */
  type: 'single-spa';
}

/**
 * Defines the provided set of single-spa Pilet API extensions.
 */
export interface PiletSingleSpaApi {
  /**
   * Wraps a single-spa component for use in Piral.
   * @param lifecycle The lifecycle of the single-spa component.
   * @returns The Piral single-spa component.
   */
  fromSingleSpa<TProps>(lifecycle: SingleSpaLifecycle<TProps>): SingleSpaComponent<TProps>;
}
