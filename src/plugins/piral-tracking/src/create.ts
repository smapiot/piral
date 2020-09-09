import type { PiralPlugin } from 'piral-core';
import { PiletTrackingApi, SeverityLevel } from './types';

/**
 * Available configuration options for the tracking plugin.
 */
export interface TrackingConfig {}

/**
 * Creates the Pilet API extensions for tracking and telemetry.
 */
export function createTrackingApi(config: TrackingConfig = {}): PiralPlugin<PiletTrackingApi> {
  return () => (api, meta) => ({
    trackEvent(name, properties = {}, measurements = {}) {
      api.emit('track-event', {
        name,
        pilet: meta.name,
        properties,
        measurements,
      });
    },
    trackError(error, properties = {}, measurements = {}, severityLevel = SeverityLevel.information) {
      api.emit('track-error', {
        pilet: meta.name,
        error,
        properties,
        measurements,
        severityLevel,
      });
    },
    trackFrame(name) {
      api.emit('track-frame-start', {
        name,
        pilet: meta.name,
      });
      return (properties = {}, measurements = {}) =>
        api.emit('track-frame-end', {
          name,
          pilet: meta.name,
          properties,
          measurements,
        });
    },
  });
}
