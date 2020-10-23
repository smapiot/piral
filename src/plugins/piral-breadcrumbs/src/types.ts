import { ComponentType, ReactChild } from 'react';
import { Dict, BaseRegistration } from 'piral-core';

declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends PiletBreadcrumbsApi {}

  interface PiralCustomState {}

  interface PiralCustomActions {
    /**
     * Registers a new breadcrumb.
     * @param name The name of the breadcrumb.
     * @param value The breadcrumb registration.
     */
    registerBreadcrumb(name: string, value: BreadcrumbRegistration): void;
    /**
     * Unregisters an existing breadcrumb.
     * @param name The name of the breadcrumb to be removed.
     */
    unregisterBreadcrumb(name: string): void;
  }

  interface PiralCustomRegistryState {
    /**
     * The registered breadcrumbs.
     */
    breadcrumbs: Dict<BreadcrumbRegistration>;
  }

  interface PiralCustomComponentsState {
    /**
     * The breadcrumbs container component.
     */
    BreadcrumbsContainer: ComponentType<BreadcrumbsContainerProps>;
    /**
     * The breadcrumb item component.
     */
    BreadcrumbItem: ComponentType<BreadcrumbItemProps>;
  }
}

export interface BreadcrumbsContainerProps {}

export interface BreadcrumbItemProps extends Omit<BreadcrumbSettings, "title"> {
  /**
   * Determins if the breadcrumb is the current page.
   */
  current: boolean;
}

export interface PiralCustomBreadcrumbSettings {}

export interface BreadcrumbSettings extends PiralCustomBreadcrumbSettings {
  /**
   * Gets the path of breadcrumb for navigation purposes.
   */
  path: string;
  /**
   * Gets a custom matching function to know if the breadcrumb should be selected.
   *
   * In case of a missing matcher it uses the path to regexp result of the given path.
   *
   * In case of a string it uses the path to regexp result of the given matcher.
   */
  matcher?: string | RegExp;
  /**
   * The breadcrumb's parent breadcrumb. Supply the path of the breadcrumb here, e.g.,
   * if we are currently in "/foo/bar", you could provide "/foo" to get the breadcrumb
   * associated with the path "/foo".
   *
   * If a path is missing for some reason, the closest matching one will be taken as
   * parent.
   */
  parent?: string;
  /**
   * The title of the breadcrumb.
   */
  title: ReactChild,
}

export interface BreadcrumbRegistration extends BaseRegistration {
  matcher: RegExp;
  settings: BreadcrumbSettings;
}

export interface PiletBreadcrumbsApi {
  /**
   * Registers a breadcrumb with the provided settings.
   * @param settings The settings for configuring the breadcrumb.
   */
  registerBreadcrumb(settings: BreadcrumbSettings): void;
  /**
   * Registers a named breadcrumb with the provided settings.
   * The name has to be unique within the current pilet.
   * @param name The name of the breadcrumb.
   * @param settings The settings for configuring the breadcrumb.
   */
  registerBreadcrumb(name: string, settings: BreadcrumbSettings): void;
  /**
   * Unregisters a breadcrumb known by the given name.
   * Only previously registered tiles can be unregistered.
   * @param name The name of the breadcrumb to unregister.
   */
  unregisterBreadcrumb(name: string): void;
}
