import { syncStrategy } from './strategies';
import { PiletMetadata } from './types';

function createMockApi(meta: PiletMetadata) {
  return {
    meta,
    emit: jest.fn(),
    off: jest.fn(),
    on: jest.fn(),
  };
}

describe('Piral-Base strategies module', () => {
  it('syncStrategy evaluates all in one sweep', async () => {
    const setupMock = jest.fn();
    const callbackMock = jest.fn();
    await syncStrategy(
      {
        createApi: createMockApi,
        fetchPilets: jest.fn(),
        pilets: [
          {
            setup: setupMock,
            hash: '',
            name: '',
            version: '',
          },
          {
            setup: setupMock,
            hash: '',
            name: '',
            version: '',
          },
        ],
      },
      callbackMock,
    );

    expect(setupMock).toHaveBeenCalledTimes(2);
    expect(callbackMock).toHaveBeenCalledTimes(1);
    expect(callbackMock.mock.calls[0][0]).toBeUndefined();
    expect(callbackMock.mock.calls[0][1]).toHaveLength(2);
  });

  it('syncStrategy evaluates also with no modules', async () => {
    const setupMock = jest.fn();
    const callbackMock = jest.fn();
    await syncStrategy(
      {
        createApi: createMockApi,
        fetchPilets: jest.fn(),
        pilets: [],
      },
      callbackMock,
    );

    expect(setupMock).toHaveBeenCalledTimes(0);
    expect(callbackMock).toHaveBeenCalledTimes(1);
    expect(callbackMock.mock.calls[0][0]).toBeUndefined();
    expect(callbackMock.mock.calls[0][1]).toHaveLength(0);
  });

  it('syncStrategy reports error if failed due to invalid arguments', async () => {
    const setupMock = jest.fn();
    const callbackMock = jest.fn();
    await syncStrategy(
      {
        createApi: createMockApi,
        fetchPilets: jest.fn(),
        pilets: true as any,
      },
      callbackMock,
    );

    expect(setupMock).toHaveBeenCalledTimes(0);
    expect(callbackMock).toHaveBeenCalledTimes(1);
    expect(callbackMock.mock.calls[0][0]).not.toBeUndefined();
    expect(callbackMock.mock.calls[0][1]).toHaveLength(0);
  });
});
