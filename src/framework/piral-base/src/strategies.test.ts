import {
  asyncStrategy,
  blazingStrategy,
  standardStrategy,
  syncStrategy,
  createProgressiveStrategy,
} from './strategies';
import { PiletMetadata, LoadPiletsOptions, Pilet } from './types';

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

  it('blazingStrategy evaluates with predefined pilets', async () => {
    // Arrange
    const setupMock = jest.fn();
    const callbackMock = jest.fn();
    const pilets: Array<Pilet> = [
      {
        setup: setupMock,
        hash: '12g',
        name: 'somePilet',
        version: '1',
      },
      {
        setup: setupMock,
        hash: '99a',
        name: 'anotherPilet',
        version: '2',
      },
    ];
    const loadingOptions: LoadPiletsOptions = {
      createApi: createMockApi,
      pilets: pilets,
      fetchPilets: jest.fn(() => Promise.resolve(pilets)),
      loadPilet: jest.fn((m) => Promise.resolve(m as any)),
      dependencies: jest.fn(),
    };

    // Act
    await blazingStrategy(loadingOptions, callbackMock);
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Assert
    expect(setupMock).toHaveBeenCalledTimes(pilets.length);
    expect(callbackMock).toHaveBeenCalledTimes(1);
    expect(callbackMock.mock.calls[0][0]).toBeUndefined();
    expect(callbackMock.mock.calls[0][1]).toHaveLength(pilets.length);
  });

  it('blazingStrategy evaluates all in one sweep', async () => {
    // Arrange
    const setupMock = jest.fn();
    const callbackMock = jest.fn();
    const pilets: Array<Pilet> = [
      {
        setup: setupMock,
        hash: '12g',
        name: 'somePilet',
        version: '1',
      },
      {
        setup: setupMock,
        hash: '99a',
        name: 'anotherPilet',
        version: '2',
      },
    ];
    const loadingOptions: LoadPiletsOptions = {
      createApi: createMockApi,
      fetchPilets: jest.fn(() => Promise.resolve(pilets)),
      loadPilet: jest.fn((m) => Promise.resolve(m as any)),
      dependencies: jest.fn(),
    };

    // Act
    await blazingStrategy(loadingOptions, callbackMock);
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Assert
    expect(setupMock).toHaveBeenCalledTimes(2);
    expect(callbackMock).toHaveBeenCalledTimes(2);
    expect(callbackMock.mock.calls[0][0]).toBeUndefined();
    expect(callbackMock.mock.calls[0][1]).toHaveLength(1);
    expect(callbackMock.mock.calls[1][0]).toBeUndefined();
    expect(callbackMock.mock.calls[1][1]).toHaveLength(2);
  });

  it('blazingStrategy evaluates also with no modules', async () => {
    // Arrange
    const setupMock = jest.fn();
    const callbackMock = jest.fn();
    const pilets: Array<Pilet> = [];
    const loadingOptions: LoadPiletsOptions = {
      createApi: createMockApi,
      fetchPilets: jest.fn(() => Promise.resolve(pilets)),
      loadPilet: jest.fn((m) => Promise.resolve(m as any)),
      dependencies: jest.fn(),
      pilets: pilets,
    };

    // Act
    await blazingStrategy(loadingOptions, callbackMock);

    // Assert
    expect(setupMock).toHaveBeenCalledTimes(0);
    expect(callbackMock).toHaveBeenCalledTimes(0);
  });

  it('blazingStrategy reports error if failed due to invalid arguments', async () => {
    // Arrange
    const setupMock = jest.fn();
    const callbackMock = jest.fn();
    const pilets = true as any;
    const invalidLoadPiletOptions: LoadPiletsOptions = {
      createApi: createMockApi,
      fetchPilets: jest.fn(() => Promise.resolve(pilets)),
      pilets: pilets,
    };

    // Act
    await expect(blazingStrategy(invalidLoadPiletOptions, callbackMock)).rejects.toThrow();

    // Assert
    expect(setupMock).toHaveBeenCalledTimes(0);
    expect(callbackMock).toHaveBeenCalledTimes(0);
  });

  it('standardStrategy evaluates all in one sweep', async () => {
    // Arrange
    const setupMock = jest.fn();
    const callbackMock = jest.fn();
    const pilets: Array<Pilet> = [
      {
        setup: setupMock,
        hash: '12g',
        name: 'somePilet',
        version: '1',
      },
      {
        setup: setupMock,
        hash: '99a',
        name: 'anotherPilet',
        version: '2',
      },
    ];
    const loadingOptions: LoadPiletsOptions = {
      createApi: createMockApi,
      fetchPilets: jest.fn(() => Promise.resolve(pilets)),
      pilets: pilets,
    };

    // Act
    await standardStrategy(loadingOptions, callbackMock);

    // Assert
    expect(setupMock).toHaveBeenCalledTimes(2);
    expect(callbackMock).toHaveBeenCalledTimes(1);
    expect(callbackMock.mock.calls[0][0]).toBeUndefined();
    expect(callbackMock.mock.calls[0][1]).toHaveLength(2);
  });

  it('standardStrategy evaluates also with no modules', async () => {
    // Arrange
    const callbackMock = jest.fn();
    const loadingOptions: LoadPiletsOptions = {
      createApi: createMockApi,
      fetchPilets: jest.fn(() => Promise.resolve([])),
      pilets: [],
    };

    // Act
    await standardStrategy(loadingOptions, callbackMock);

    // Assert
    expect(callbackMock).toHaveBeenCalledTimes(1);
    expect(callbackMock.mock.calls[0][0]).toBeUndefined();
    expect(callbackMock.mock.calls[0][1]).toHaveLength(0);
  });

  it('standardStrategy reports error if failed due to invalid arguments', async () => {
    // Arrange
    const setupMock = jest.fn();
    const callbackMock = jest.fn();
    const pilets = true as any;
    const invalidLoadPiletOptions: LoadPiletsOptions = {
      createApi: createMockApi,
      fetchPilets: jest.fn(() => Promise.resolve(pilets)),
      pilets: pilets,
    };

    // Act
    await expect(blazingStrategy(invalidLoadPiletOptions, callbackMock)).rejects.toThrow();

    // Assert
    expect(setupMock).toHaveBeenCalledTimes(0);
    expect(callbackMock).toHaveBeenCalledTimes(0);
  });

  it('progressiveStrategy evaluates synchronously', async () => {
    // Arrange
    const setupMock = jest.fn();
    const callbackMock = jest.fn();
    const pilets: Array<Pilet> = [
      {
        setup: setupMock,
        hash: '12g',
        name: 'somePilet',
        version: '1',
      },
      {
        setup: setupMock,
        hash: '99a',
        name: 'anotherPilet',
        version: '2',
      },
    ];
    const loadingOptions: LoadPiletsOptions = {
      createApi: createMockApi,
      fetchPilets: jest.fn(() => Promise.resolve(pilets)),
      pilets: pilets,
    };

    // Act
    const strategy = createProgressiveStrategy(false);
    await strategy(loadingOptions, callbackMock);

    // Assert
    expect(setupMock).toHaveBeenCalledTimes(pilets.length);
    expect(callbackMock).toHaveBeenCalledTimes(1);
    expect(callbackMock.mock.calls[0][0]).toBeUndefined();
    expect(callbackMock.mock.calls[0][1]).toHaveLength(pilets.length);
  });

  it('asyncStrategy evaluates also with no modules', async () => {
    // Arrange
    const callbackMock = jest.fn();
    const loadingOptions: LoadPiletsOptions = {
      createApi: createMockApi,
      fetchPilets: jest.fn(() => Promise.resolve([])),
      pilets: [],
    };

    // Act
    await asyncStrategy(loadingOptions, callbackMock);

    // Assert (We gonna wait since the pilet loading happens asynchronously)
    setTimeout(() => {
      expect(callbackMock).toHaveBeenCalledTimes(1);
      expect(callbackMock.mock.calls[0][0]).toBeUndefined();
      expect(callbackMock.mock.calls[0][1]).toHaveLength(0);
    }, 1000);
  });
});
