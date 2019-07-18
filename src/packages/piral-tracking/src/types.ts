import * as piralCore from 'piral-core';

declare module 'piral-core' {
  interface PiralEventMap {
    'track-event': PiralTrackEventEvent;
    'track-error': PiralTrackErrorEvent;
    'track-frame-start': PiralTrackStartFrameEvent;
    'track-frame-end': PiralTrackEndFrameEvent;
  }
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
