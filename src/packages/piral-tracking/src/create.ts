import { Extend } from 'piral-core';
import { PiletTrackingApi, SeverityLevel } from './types';

/**
 * Available configuration options for the tracking extension.
 */
export interface TrackingConfig {}

/**
 * Creates a new set of Piral tracking and telemetry API extensions.
 */
export function createTrackingApi(config: TrackingConfig = {}): Extend<PiletTrackingApi> {
  return () => api => ({
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
  });
}
