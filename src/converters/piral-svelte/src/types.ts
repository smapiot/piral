import type { ForeignComponent } from 'piral-core';

declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends PiletSvelteApi {}

  interface PiralCustomComponentConverters<TProps> {
    svelte(component: SvelteComponent<TProps>): ForeignComponent<TProps>;
  }
}

export interface SvelteOptions<TProps> {
  target: Element;
  props: TProps;
}

export type SvelteComponentInstance<TProps> = TProps & {
  $destroy(): void;
};

export interface SvelteModule<TProps> {
  new (opts: SvelteOptions<TProps>): SvelteComponentInstance<TProps>;
}

export interface SvelteComponent<TProps> {
  /**
   * The name of the Svelte main module to render.
   */
  Component: SvelteModule<TProps>;
  /**
   * Captures props for transport into the Svelte component.
   */
  captured?: Record<string, any>;
  /**
   * The type of the Svelte component.
   */
  type: 'svelte';
}

/**
 * Defines the provided set of Svelte Pilet API extensions.
 */
export interface PiletSvelteApi {
  /**
   * Wraps a Svelte module for use in Piral.
   * @param Component The name of the root component.
   * @param captured The optionally captured props.
   * @returns The Piral Svelte component.
   */
  fromSvelte<TProps>(Component: SvelteModule<TProps>, captured?: Record<string, any>): SvelteComponent<TProps>;
  /**
   * Gets the name of the Svelte extension.
   */
  SvelteExtension: string;
}
