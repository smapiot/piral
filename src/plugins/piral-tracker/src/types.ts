import type {
  Dict,
  WrappedComponent,
  BaseComponentProps,
  AnyComponent,
  BaseRegistration,
  RegistrationDisposer,
} from 'piral-core';

declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends PiletTrackerApi {}

  interface PiralCustomActions {
    /**
     * Registers a new tracker.
     * @param name The name of the tracker.
     * @param value The registration data.
     */
    registerTracker(name: string, value: TrackerRegistration): void;
    /**
     * Unregisters an existing tracker.
     * @param name The name of the tracker to be removed.
     */
    unregisterTracker(name: string): void;
  }

  interface PiralCustomRegistryState {
    /**
     * The registered trackers.
     */
    trackers: Dict<TrackerRegistration>;
  }

  interface PiralCustomErrors {
    tracker: TrackerErrorInfoProps;
  }
}

export interface TrackerErrorInfoProps {
  /**
   * The type of the error.
   */
  type: 'tracker';
  /**
   * The provided error details.
   */
  error: any;
  /**
   * The name of the pilet emitting the error.
   */
  pilet?: string;
}

export interface TrackerRegistration extends BaseRegistration {
  component: WrappedComponent<BaseComponentProps>;
}

export interface PiletTrackerApi {
  /**
   * Registers a tracker component.
   * The name has to be unique within the current pilet.
   * @param name The name of the tracker.
   * @param Component The component to be mounted permanently.
   */
  registerTracker(name: string, Component: AnyComponent<BaseComponentProps>): RegistrationDisposer;
  /**
   * Registers a tracker component.
   * @param Component The component to be mounted permamently.
   */
  registerTracker(Component: AnyComponent<BaseComponentProps>): RegistrationDisposer;
  /**
   * Unregisters a tracker known by the given name.
   * Only previously registered trackers can be unregistered.
   * @param name The name of the tracker to unregister.
   */
  unregisterTracker(name: string): void;
}
