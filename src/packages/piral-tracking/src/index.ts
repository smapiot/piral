import { PiralCoreApi } from 'piral-core';
import { SeverityLevel, Tracker } from './types';

/**
 * Defines the provided set of tracking and telemetry Pilet API extensions.
 */
export interface PiralTrackingApi {
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

/**
 * Creates a new set of Piral tracking and telemetry API extensions.
 * @param api The API to extend.
 */
export function createTrackingApi<T>(api: PiralCoreApi<T>): PiralTrackingApi {
  return {
    trackEvent(name, properties = {}, measurements = {}) {
      api.emit('track-event', {
        name,
        properties,
        measurements,
      });
    },
    trackError(error, properties = {}, measurements = {}, severityLevel = SeverityLevel.Information) {
      api.emit('track-error', {
        error,
        properties,
        measurements,
        severityLevel,
      });
    },
    trackFrame(name) {
      api.emit('track-frame-start', {
        name,
      });
      return (properties = {}, measurements = {}) =>
        api.emit('track-frame-end', {
          name,
          properties,
          measurements,
        });
    },
  };
}
