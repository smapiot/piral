import { ComponentType } from 'react';
import { RouteComponentProps } from 'react-router-dom';

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
  | ExtensionErrorInfoProps
  | LoadingErrorInfoProps;

export type ErrorType = ErrorInfoProps['type'];

export interface LoaderProps {}
