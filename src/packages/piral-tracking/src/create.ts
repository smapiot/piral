import { PiletApi } from 'piral-core';
import { PiralTrackingApi, SeverityLevel } from './types';

/**
 * Creates a new set of Piral tracking and telemetry API extensions.
 * @param api The API to extend.
 */
export function createTrackingApi(api: PiletApi): PiralTrackingApi {
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
