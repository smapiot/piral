import { ComponentType } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { FirstParametersOf, UnionOf } from './common';
import { PiralCustomErrors, PiralCustomComponentConverters } from './custom';

export interface ComponentConverters<TProps> extends PiralCustomComponentConverters<TProps> {
  html(component: HtmlComponent<TProps>): ForeignComponent<TProps>;
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

export type AnyComponent<T> = ComponentType<T> | FirstParametersOf<ComponentConverters<T>>;

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

export type ErrorInfoProps = UnionOf<Errors>;

export interface LoaderProps {}

export interface LayoutProps {}

export interface RouterProps {}
