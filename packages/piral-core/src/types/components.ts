import { ComponentType } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Dict } from './utils';

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

export interface NotFoundErrorInfoProps extends RouteComponentProps {
  /**
   * The type of the error.
   */
  type: 'not_found';
}

export interface PageErrorInfoProps extends RouteComponentProps {
  /**
   * The type of the error.
   */
  type: 'page';
}

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

export type ErrorInfoProps =
  | NotFoundErrorInfoProps
  | PageErrorInfoProps
  | FeedErrorInfoProps
  | LoadingErrorInfoProps
  | FormErrorInfoProps;

export interface LoaderProps {}

export interface DashboardProps extends RouteComponentProps {}
