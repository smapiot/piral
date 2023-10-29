import 'systemjs/dist/system.js';
import 'systemjs/dist/extras/named-register.js';

import { describe, it, expect, vitest } from 'vitest';

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
    emit: vitest.fn(),
    off: vitest.fn(),
    on: vitest.fn(),
  };
}

describe('Piral-Base strategies module', () => {
  it('syncStrategy evaluates all in one sweep', async () => {
    const setupMock = vitest.fn();
    const callbackMock = vitest.fn();
    await syncStrategy(
      {
        createApi: createMockApi,
        fetchPilets: vitest.fn(),
        pilets: [
          {
            setup: setupMock,
            hash: '',
            name: '',
            version: '',
          } as any,
          {
            setup: setupMock,
            hash: '',
            name: '',
            version: '',
          } as any,
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
    const setupMock = vitest.fn();
    const callbackMock = vitest.fn();
    await syncStrategy(
      {
        createApi: createMockApi,
        fetchPilets: vitest.fn(),
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
    const setupMock = vitest.fn();
    const callbackMock = vitest.fn();
    await syncStrategy(
      {
        createApi: createMockApi,
        fetchPilets: vitest.fn(),
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
    const setupMock = vitest.fn();
    const callbackMock = vitest.fn();
    const pilets: Array<Pilet> = [
      {
        setup: setupMock,
        hash: '12g',
        name: 'somePilet',
        version: '1',
      } as any,
      {
        setup: setupMock,
        hash: '99a',
        name: 'anotherPilet',
        version: '2',
      } as any,
    ];
    const loadingOptions: LoadPiletsOptions = {
      createApi: createMockApi,
      pilets: pilets,
      fetchPilets: vitest.fn(() => Promise.resolve(pilets)),
      loadPilet: vitest.fn((m) => Promise.resolve(m as any)),
      dependencies: vitest.fn(),
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
    const setupMock = vitest.fn();
    const callbackMock = vitest.fn();
    const pilets: Array<Pilet> = [
      {
        setup: setupMock,
        hash: '12g',
        name: 'somePilet',
        version: '1',
      } as any,
      {
        setup: setupMock,
        hash: '99a',
        name: 'anotherPilet',
        version: '2',
      } as any,
    ];
    const loadingOptions: LoadPiletsOptions = {
      createApi: createMockApi,
      fetchPilets: vitest.fn(() => Promise.resolve(pilets)),
      loadPilet: vitest.fn((m) => Promise.resolve(m as any)),
      dependencies: vitest.fn(),
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
    const setupMock = vitest.fn();
    const callbackMock = vitest.fn();
    const pilets: Array<Pilet> = [];
    const loadingOptions: LoadPiletsOptions = {
      createApi: createMockApi,
      fetchPilets: vitest.fn(() => Promise.resolve(pilets)),
      loadPilet: vitest.fn((m) => Promise.resolve(m as any)),
      dependencies: vitest.fn(),
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
    const setupMock = vitest.fn();
    const callbackMock = vitest.fn();
    const pilets = true as any;
    const invalidLoadPiletOptions: LoadPiletsOptions = {
      createApi: createMockApi,
      fetchPilets: vitest.fn(() => Promise.resolve(pilets)),
      pilets: pilets,
    };

    // Act
    await expect(blazingStrategy(invalidLoadPiletOptions, callbackMock)).rejects.toThrowError();

    // Assert
    expect(setupMock).toHaveBeenCalledTimes(0);
    expect(callbackMock).toHaveBeenCalledTimes(0);
  });

  it('standardStrategy evaluates all in one sweep', async () => {
    // Arrange
    const setupMock = vitest.fn();
    const callbackMock = vitest.fn();
    const pilets: Array<Pilet> = [
      {
        setup: setupMock,
        hash: '12g',
        name: 'somePilet',
        version: '1',
      } as any,
      {
        setup: setupMock,
        hash: '99a',
        name: 'anotherPilet',
        version: '2',
      } as any,
    ];
    const loadingOptions: LoadPiletsOptions = {
      createApi: createMockApi,
      fetchPilets: vitest.fn(() => Promise.resolve(pilets)),
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
    const callbackMock = vitest.fn();
    const loadingOptions: LoadPiletsOptions = {
      createApi: createMockApi,
      fetchPilets: vitest.fn(() => Promise.resolve([])),
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
    const setupMock = vitest.fn();
    const callbackMock = vitest.fn();
    const pilets = true as any;
    const invalidLoadPiletOptions: LoadPiletsOptions = {
      createApi: createMockApi,
      fetchPilets: vitest.fn(() => Promise.resolve(pilets)),
      pilets: pilets,
    };

    // Act
    await expect(blazingStrategy(invalidLoadPiletOptions, callbackMock)).rejects.toThrowError();

    // Assert
    expect(setupMock).toHaveBeenCalledTimes(0);
    expect(callbackMock).toHaveBeenCalledTimes(0);
  });

  it('progressiveStrategy evaluates synchronously', async () => {
    // Arrange
    const setupMock = vitest.fn();
    const callbackMock = vitest.fn();
    const pilets: Array<Pilet> = [
      {
        setup: setupMock,
        hash: '12g',
        name: 'somePilet',
        version: '1',
      } as any,
      {
        setup: setupMock,
        hash: '99a',
        name: 'anotherPilet',
        version: '2',
      } as any,
    ];
    const loadingOptions: LoadPiletsOptions = {
      createApi: createMockApi,
      fetchPilets: vitest.fn(() => Promise.resolve(pilets)),
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
    const callbackMock = vitest.fn();
    const loadingOptions: LoadPiletsOptions = {
      createApi: createMockApi,
      fetchPilets: vitest.fn(() => Promise.resolve([])),
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
