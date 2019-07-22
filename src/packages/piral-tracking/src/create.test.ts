import { createTrackingApi } from './create';

describe('Create Tracking API Module', () => {
  it('createApi trackError fires an event', () => {
    const originalApi = {
      emit: jest.fn(),
    };
    const api = createTrackingApi(originalApi as any);
    api.trackError('my error');
    expect(originalApi.emit).toHaveBeenCalledWith('track-error', {
      error: 'my error',
      properties: {},
      measurements: {},
      severityLevel: 1,
    });
  });

  it('createApi trackEvent fires an event', () => {
    const originalApi = {
      emit: jest.fn(),
    };
    const api = createTrackingApi(originalApi as any);
    api.trackEvent('my event');
    expect(originalApi.emit).toHaveBeenCalledWith('track-event', {
      name: 'my event',
      properties: {},
      measurements: {},
    });
  });

  it('createApi trackFrame fires an event and leaves back a tracker', () => {
    const originalApi = {
      emit: jest.fn(),
    };
    const api = createTrackingApi(originalApi as any);
    const tracker = api.trackFrame('my frame');
    expect(originalApi.emit).toHaveBeenCalledWith('track-frame-start', {
      name: 'my frame',
    });
    tracker();
    expect(originalApi.emit).toHaveBeenLastCalledWith('track-frame-end', {
      name: 'my frame',
      properties: {},
      measurements: {},
    });
  });
});
