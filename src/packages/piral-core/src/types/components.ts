import { ComponentType } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Dict } from './common';
import { MenuType } from './menu';

export interface BaseComponentProps<TApi> {
  /**
   * The currently used piral API.
   */
  piral: TApi;
}

export interface ExtensionComponentProps<TApi, T = Dict<any>> extends BaseComponentProps<TApi> {
  /**
   * The provided parameters for showing the extension.
   */
  params: T;
}

export interface MenuComponentProps<TApi> extends BaseComponentProps<TApi> {}

export interface TileComponentProps<TApi> extends BaseComponentProps<TApi> {
  /**
   * The currently used number of columns.
   */
  columns: number;
  /**
   * The currently used number of rows.
   */
  rows: number;
}

export interface RouteBaseProps<TApi, UrlParams = any, UrlState = any>
  extends RouteComponentProps<UrlParams, {}, UrlState>,
    BaseComponentProps<TApi> {}

export interface ModalComponentProps<TApi, TOpts> extends BaseComponentProps<TApi> {
  /**
   * Callback for closing the modal programmatically.
   */
  onClose(): void;
  /**
   * Provides the passed in options for this particular modal.
   */
  options?: TOpts;
}

export interface PageComponentProps<TApi, T = any, S = any> extends RouteBaseProps<TApi, T, S> {}

export interface ForeignComponent<TProps> {
  /**
   * Renders a component into the provided element using the given props and context.
   */
  (element: HTMLElement, props: TProps, ctx: any): void;
}

export type AnyComponent<T> = ComponentType<T> | ForeignComponent<T>;

/**
 * The error used when a route cannot be resolved.
 */
export interface NotFoundErrorInfoProps extends RouteComponentProps {
  /**
   * The type of the error.
   */
  type: 'not_found';
}

/**
 * The error used when a registered page component crashes.
 */
export interface PageErrorInfoProps extends RouteComponentProps {
  /**
   * The type of the error.
   */
  type: 'page';
  /**
   * The provided error details.
   */
  error: any;
}

/**
 * The error used when loading a feed resulted in an error.
 */
export interface FeedErrorInfoProps {
  /**
   * The type of the error.
   */
  type: 'feed';
  /**
   * The provided error details.
   */
  error: any;
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

/**
 * The error used when the app could not be loaded.
 */
export interface LoadingErrorInfoProps {
  /**
   * The type of the error.
   */
  type: 'loading';
  /**
   * The provided error details.
   */
  error: any;
}

/**
 * The error used when a registered tile component crashed.
 */
export interface TileErrorInfoProps {
  /**
   * The type of the error.
   */
  type: 'tile';
  /**
   * The provided error details.
   */
  error: any;
  /**
   * The currently used number of columns.
   */
  columns: number;
  /**
   * The currently used number of rows.
   */
  rows: number;
}

/**
 * The error used when a registered menu item component crashed.
 */
export interface MenuItemErrorInfoProps {
  /**
   * The type of the error.
   */
  type: 'menu';
  /**
   * The provided error details.
   */
  error: any;
  /**
   * The type of the used menu.
   */
  menu: MenuType;
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

/**
 * The error used when a registered extension component crashed.
 */
export interface ExtensionErrorInfoProps {
  /**
   * The type of the error.
   */
  type: 'extension';
  /**
   * The provided error details.
   */
  error: any;
}

export type ErrorInfoProps =
  | NotFoundErrorInfoProps
  | PageErrorInfoProps
  | TileErrorInfoProps
  | MenuItemErrorInfoProps
  | ExtensionErrorInfoProps
  | ModalErrorInfoProps
  | FeedErrorInfoProps
  | LoadingErrorInfoProps
  | FormErrorInfoProps;

export type ErrorType = ErrorInfoProps['type'];

export interface LoaderProps {}

export interface DashboardProps extends RouteComponentProps {}
