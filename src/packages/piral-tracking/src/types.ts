import 'piral-core';

declare module 'piral-core/lib/types/custom' {
  interface PiralCustomEventMap {
    'track-event': PiralTrackEventEvent;
    'track-error': PiralTrackErrorEvent;
    'track-frame-start': PiralTrackStartFrameEvent;
    'track-frame-end': PiralTrackEndFrameEvent;
  }

  interface PiletCustomApi extends PiletTrackingApi {}
}

export const enum SeverityLevel {
  /**
   * Verbose severity level.
   */
  Verbose = 0,
  /**
   * Information severity level.
   */
  Information = 1,
  /**
   * Warning severity level.
   */
  Warning = 2,
  /**
   * Error severity level.
   */
  Error = 3,
  /**
   * Critical severity level.
   */
  Critical = 4,
}

export interface Tracker {
  /**
   * Finishes the created frame by optionally passing the given properties and measurements.
   */
  (properties?: any, measurements?: any): void;
}

export interface PiralTrackEventEvent {
  name: string;
  properties: any;
  measurements: any;
}

export interface PiralTrackErrorEvent {
  error: any;
  properties: any;
  measurements: any;
  severityLevel: SeverityLevel;
}

export interface PiralTrackStartFrameEvent {
  name: string;
}

export interface PiralTrackEndFrameEvent {
  name: string;
  properties: any;
  measurements: any;
}

/**
 * Defines the provided set of tracking and telemetry Pilet API extensions.
 */
export interface PiletTrackingApi {
  /**
   * Tracks a simple (singular) event at the current point in time.
   * @param name The name of the event to track.
   * @param properties The optional tracking properties to submit.
   * @param measurements The optional tracking measurements to submit.
   */
  trackEvent(name: string, properties?: any, measurements?: any): void;
  /**
   * Tracks an exception event at the current point in time.
   * @param exception The Error from a catch clause, or the string error message.
   * @param properties The optional tracking properties to submit.
   * @param measurements The optional tracking measurements to submit.
   * @param severityLevel The optional severity level of error.
   */
  trackError(error: Error | string, properties?: any, measurements?: any, severityLevel?: SeverityLevel): void;
  /**
   * Starts tracking an event frame at the current point in time.
   * @param name The name of the event to start tracking.
   * @returns The method to use for ending the current event frame.
   */
  trackFrame(name: string): Tracker;
}
