import { createTrackingApi } from './create';
import { PiletTrackingApi } from './types';

function createMockContainer() {
  const events = {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  };
  return {
    context: {
      ...events,
      defineActions() {},
    } as any,
    api: {
      ...events,
    } as any,
    meta: {
      name: 'sample',
    },
  };
}

describe('Create Tracking API Module', () => {
  it('createApi trackError fires an event', () => {
    const container = createMockContainer();
    const api = (createTrackingApi()(container.context) as any)(container.api, container.meta) as PiletTrackingApi;
    api.trackError('my error');
    expect(container.api.emit).toHaveBeenCalledWith('track-error', {
      error: 'my error',
      pilet: 'sample',
      properties: {},
      measurements: {},
      severityLevel: 1,
    });
  });

  it('createApi trackEvent fires an event', () => {
    const container = createMockContainer();
    const api = (createTrackingApi()(container.context) as any)(container.api, container.meta) as PiletTrackingApi;
    api.trackEvent('my event');
    expect(container.api.emit).toHaveBeenCalledWith('track-event', {
      name: 'my event',
      pilet: 'sample',
      properties: {},
      measurements: {},
    });
  });

  it('createApi trackFrame fires an event and leaves back a tracker', () => {
    const container = createMockContainer();
    const api = (createTrackingApi()(container.context) as any)(container.api, container.meta) as PiletTrackingApi;
    const tracker = api.trackFrame('my frame');
    expect(container.api.emit).toHaveBeenCalledWith('track-frame-start', {
      name: 'my frame',
      pilet: 'sample',
    });
    tracker();
    expect(container.api.emit).toHaveBeenLastCalledWith('track-frame-end', {
      name: 'my frame',
      pilet: 'sample',
      properties: {},
      measurements: {},
    });
  });
});
