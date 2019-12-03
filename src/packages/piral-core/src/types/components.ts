import { ComponentType } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { FirstParametersOf, UnionOf } from './common';
import { PiralCustomErrors, PiralCustomComponentConverters } from './custom';
import { LayoutType } from './layout';

export interface ComponentConverters<TProps> extends PiralCustomComponentConverters<TProps> {
  html(component: HtmlComponent<TProps>): ForeignComponent<TProps>;
}

export interface HtmlComponent<TProps> {
  /**
   * Renders a component into the provided element using the given props and context.
   */
  component: ForeignComponent<TProps>;
  /**
   * The type of the HTML component.
   */
  type: 'html';
}

export interface ForeignComponent<TProps> {
  /**
   * Called when the component is mounted.
   * @param element The container hosting the element.
   * @param props The props to transport.
   * @param ctx The associated context.
   */
  mount(element: HTMLElement, props: TProps, ctx: any): void;
  /**
   * Called when the component should be updated.
   * @param element The container hosting the element.
   * @param props The props to transport.
   * @param ctx The associated context.
   */
  update?(element: HTMLElement, props: TProps, ctx: any): void;
  /**
   * Called when a component is unmounted.
   * @param element The container that was hosting the element.
   */
  unmount?(element: HTMLElement): void;
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

/**
 * The error used when the exact type is unknown.
 */
export interface UnknownErrorInfoProps {
  /**
   * The type of the error.
   */
  type: 'unknown';
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
  unknown: UnknownErrorInfoProps;
}

export type ErrorInfoProps = UnionOf<Errors>;

export interface LoadingIndicatorProps {}

export interface LayoutProps {
  currentLayout: LayoutType;
}

export interface RouterProps {}
