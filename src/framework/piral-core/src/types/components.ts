import type { ComponentType, ReactNode } from 'react';
import type { RouteComponentProps, SwitchProps } from 'react-router';
import type { FirstParametersOf, UnionOf } from './common';
import type { PiralCustomErrors, PiralCustomComponentConverters, PiralCustomPageMeta } from './custom';
import type { NavigationApi } from './navigation';
import type { LayoutType } from './layout';

/**
 * Mapping of available component converters.
 */
export interface ComponentConverters<TProps> extends PiralCustomComponentConverters<TProps> {
  /**
   * Converts the HTML component to a framework-independent component.
   * @param component The vanilla JavaScript component to be converted.
   */
  html(component: HtmlComponent<TProps>): ForeignComponent<TProps>;
}

/**
 * Definition of a vanilla JavaScript component.
 */
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

/**
 * The context to be transported into the generic components.
 */
export interface ComponentContext {
  /**
   * The router-independent navigation API.
   */
  navigation: NavigationApi;
  /**
   * The internal router object.
   * @deprecated Exposes internals that can change at any time.
   */
  router: any;
  /**
   * The public path of the application.
   */
  publicPath: string;
}

/**
 * Generic definition of a framework-independent component.
 */
export interface ForeignComponent<TProps> {
  /**
   * Called when the component is mounted.
   * @param element The container hosting the element.
   * @param props The props to transport.
   * @param ctx The associated context.
   * @param locals The local state of this component instance.
   */
  mount(element: HTMLElement, props: TProps, ctx: ComponentContext, locals: Record<string, any>): void;
  /**
   * Called when the component should be updated.
   * @param element The container hosting the element.
   * @param props The props to transport.
   * @param ctx The associated context.
   * @param locals The local state of this component instance.
   */
  update?(element: HTMLElement, props: TProps, ctx: ComponentContext, locals: Record<string, any>): void;
  /**
   * Called when a component is unmounted.
   * @param element The container that was hosting the element.
   * @param locals The local state of this component instance.
   */
  unmount?(element: HTMLElement, locals: Record<string, any>): void;
}

/**
 * Possible shapes for a component.
 */
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
  /**
   * The name of the pilet emitting the error.
   */
  pilet?: string;
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
  /**
   * The name of the pilet emitting the error.
   */
  pilet?: string;
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
  /**
   * The name of the pilet emitting the error.
   */
  pilet?: string;
}

/**
 * Map of all error types to their respective props.
 */
export interface Errors extends PiralCustomErrors {
  /**
   * The props type for an extension error.
   */
  extension: ExtensionErrorInfoProps;
  /**
   * The props type for a loading error.
   */
  loading: LoadingErrorInfoProps;
  /**
   * The props type for a page error.
   */
  page: PageErrorInfoProps;
  /**
   * The props type for a not found error.
   */
  not_found: NotFoundErrorInfoProps;
  /**
   * The props type for an unknown error.
   */
  unknown: UnknownErrorInfoProps;
}

/**
 * The props for the ErrorInfo component.
 */
export type ErrorInfoProps = UnionOf<Errors>;

/**
 * The props of a Loading indicator component.
 */
export interface LoadingIndicatorProps {}

/**
 * The props of a Layout component.
 */
export interface LayoutProps {
  /**
   * The currently selected layout type.
   */
  currentLayout: LayoutType;
  /**
   * The page's content.
   */
  children: ReactNode;
}

/**
 * The props of a Router component.
 */
export interface RouterProps {
  /**
   * The content to be rendered inside the router.
   */
  children?: ReactNode;
  /**
   * The public path to use.
   */
  publicPath: string;
}

/**
 * The meta data registered for a page.
 */
export interface PiralPageMeta extends PiralCustomPageMeta {}

/**
 * Represents a path in the app registration.
 */
export interface AppPath {
  /**
   * The exact path to use.
   */
  path: string;
  /**
   * The associated route matcher.
   */
  matcher: RegExp;
  /**
   * The page metadata.
   */
  meta: PiralPageMeta;
  /**
   * The component to register for this path.
   */
  Component: ComponentType<RouteComponentProps>;
}

/**
 * The props of the RouteSwitch component.
 */
export interface RouteSwitchProps extends SwitchProps {
  /**
   * The component that should be used in case nothing was found.
   */
  NotFound: ComponentType<RouteComponentProps>;
  /**
   * The component to register for the different paths.
   */
  paths: Array<AppPath>;
}
