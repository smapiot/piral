import { asyncStrategy, blazingStrategy, standardStrategy, syncStrategy,  } from './strategies';
import { PiletMetadata, LoadPiletsOptions, PiletApiCreator, Pilet } from './types';

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

  it('blazingStrategy evaluates all in one sweep', async () => {

    // Arrange
    const setupMock = jest.fn();
    const callbackMock = jest.fn();
    const loadingOptions: LoadPiletsOptions = {
      createApi: createMockApi,
      fetchPilets: jest.fn(),
      fetchDependency: jest.fn(),
      dependencies: jest.fn(),
      getDependencies: jest.fn()
    }

    // Arrange
    await blazingStrategy(loadingOptions, callbackMock);

    // Assert
    expect(setupMock).toHaveBeenCalledTimes(2);
    expect(callbackMock).toHaveBeenCalledTimes(1);
    expect(callbackMock.mock.calls[0][0]).toBeUndefined();
    expect(callbackMock.mock.calls[0][1]).toHaveLength(2);
  });

  it('blazingStrategy evaluates also with no modules', async () => {

    // Arrange
    const callbackMock = jest.fn();
    const loadingOptions: LoadPiletsOptions = {
      createApi: createMockApi,
      fetchPilets: jest.fn(),
      pilets: [],
    };

    // Act
    await blazingStrategy(loadingOptions, callbackMock);

    // Assert
    expect(callbackMock).toHaveBeenCalledTimes(1);
    expect(callbackMock.mock.calls[0][0]).toBeUndefined();
    expect(callbackMock.mock.calls[0][1]).toHaveLength(0);
  });

  it('blazingStrategy reports error if failed due to invalid arguments', async () => {

    // Arrange
    const setupMock = jest.fn();
    const callbackMock = jest.fn();
    const invalidLoadPiletOptions: LoadPiletsOptions = {
      createApi: createMockApi,
      fetchPilets: jest.fn(),
      pilets: true as any,
    }

    // Act
    await blazingStrategy(invalidLoadPiletOptions, callbackMock);

    // Assert
    expect(setupMock).toHaveBeenCalledTimes(0);
    expect(callbackMock).toHaveBeenCalledTimes(1);
    expect(callbackMock.mock.calls[0][0]).not.toBeUndefined();
    expect(callbackMock.mock.calls[0][1]).toHaveLength(0);
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
      }
    ];
    const loadingOptions: LoadPiletsOptions = {
      createApi: createMockApi,
      fetchPilets: jest.fn(),
      pilets: pilets
    }

    // Arrange
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
      fetchPilets: jest.fn(),
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
    const invalidLoadPiletOptions: LoadPiletsOptions = {
      createApi: createMockApi,
      fetchPilets: jest.fn(),
      pilets: true as any,
    }

    // Act
    await blazingStrategy(invalidLoadPiletOptions, callbackMock);

    // Assert
    expect(setupMock).toHaveBeenCalledTimes(0);
    expect(callbackMock).toHaveBeenCalledTimes(1);
    expect(callbackMock.mock.calls[0][0]).not.toBeUndefined();
    expect(callbackMock.mock.calls[0][1]).toHaveLength(0);
  });
});
