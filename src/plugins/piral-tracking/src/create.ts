import { PiralPlugin } from 'piral-core';
import { PiletTrackingApi, SeverityLevel } from './types';

/**
 * Available configuration options for the tracking plugin.
 */
export interface TrackingConfig {}

/**
 * Creates the Pilet API extensions for tracking and telemetry.
 */
export function createTrackingApi(config: TrackingConfig = {}): PiralPlugin<PiletTrackingApi> {
  return () => api => ({
    trackEvent(name, properties = {}, measurements = {}) {
      api.emit('track-event', {
        name,
        properties,
        measurements,
      });
    },
    trackError(error, properties = {}, measurements = {}, severityLevel = SeverityLevel.information) {
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
