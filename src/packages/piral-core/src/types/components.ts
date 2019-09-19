import { ComponentType } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { FirstParameter } from './common';
import { PiralCustomErrors, PiralCustomComponentConverters } from './custom';

export interface ComponentConverters extends PiralCustomComponentConverters {
  html<TProps>(component: HtmlComponent<TProps>): ForeignComponent<TProps>;
}

export interface HtmlComponent<TProps> {
  /**
   * Renders a component into the provided element using the given props and context.
   */
  render: ForeignComponent<TProps>;
  /**
   * The type of the HTML component.
   */
  type: 'html';
}

export interface ForeignComponent<TProps> {
  (element: HTMLElement, props: TProps, ctx: any): void;
}

export type AnyComponent<T, TKey extends keyof ComponentConverters = 'html'> = ComponentType<T> | FirstParameter<ComponentConverters[TKey]>;

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

export interface Errors extends PiralCustomErrors {
  extension: ExtensionErrorInfoProps;
  loading: LoadingErrorInfoProps;
  page: PageErrorInfoProps;
  not_found: NotFoundErrorInfoProps;
}

export type ErrorInfoProps<T extends keyof Errors> = Errors[T];

export interface LoaderProps {}
