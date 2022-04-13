import type { PropsWithChildren } from 'react';
import type { RouteComponentProps } from 'react-router';
import type {
  AnyComponent,
  BaseRegistration,
  Dict,
  PageComponentProps,
  PiralPageMeta,
  RegistrationDisposer,
  WrappedComponent,
} from 'piral-core';

declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends PiletPageLayoutsApi {}

  interface PiralCustomActions {
    /**
     * Registers a new page layout.
     * @param name The name of the layout.
     * @param value The page layout registration.
     */
    registerPageLayout(name: string, value: PageLayoutRegistration): void;
    /**
     * Unregisters an existing page layout.
     * @param name The name of the page layout to be removed.
     */
    unregisterPageLayout(name: string): void;
  }

  interface PiralCustomPageMeta {
    /**
     * The layout to use for the page.
     */
    layout?: string;
  }

  interface PiralCustomRegistryState {
    /**
     * The registered page layouts.
     */
    pageLayouts: Dict<PageLayoutRegistration>;
  }

  interface PiralCustomErrors {
    pageLayout: PageLayoutErrorInfoProps;
  }
}

export interface PageLayoutRegistration extends BaseRegistration {
  component: WrappedComponent<PageComponentProps>;
}

/**
 * The error used when a page layout crashed.
 */
export interface PageLayoutErrorInfoProps extends RouteComponentProps {
  /**
   * The type of the error.
   */
  type: 'pageLayout';
  /**
   * The provided error details.
   */
  error: any;
  /**
   * The available page meta data.
   */
  meta: PiralPageMeta;
  /**
   * The name of the pilet emitting the error.
   */
  pilet?: string;
}

export interface PiletPageLayoutsApi {
  /**
   * Registers a page layout.
   * @param name The name of the layout.
   * @param layout The component responsible for the layout.
   */
  registerPageLayout(name: string, layout: AnyComponent<PropsWithChildren<PageComponentProps>>): RegistrationDisposer;
  /**
   * Unregisters a page layout.
   * @param name The name of the layout.
   */
  unregisterPageLayout(name: string): void;
}
