import { createPiletOptions, PiletOptionsConfig } from './helpers';
import { globalDependencies } from './modules';
import { PiletMetadata, Pilet } from 'piral-base';
import { Atom, swap } from '@dbeining/react-atom';

function createMockApi(meta: PiletMetadata) {
  return {
    meta,
    emit: jest.fn(),
    off: jest.fn(),
    on: jest.fn(),
  } as any;
}

function createMockContainer() {
  const state = Atom.of({
    components: {},
  });
  return {
    context: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
      state,
      setComponent(name, comp) {
        swap(state, s => ({
          ...s,
          components: {
            ...s.components,
            [name]: comp,
          },
        }));
      },
    } as any,
  };
}

describe('Piral-Core helpers module', () => {
  it('createPiletOptions creates the options using the provided pilets', () => {
    const wasUndefined = process.env.DEBUG_PIRAL === undefined;

    process.env.DEBUG_PIRAL = 'true';

    // Arrange
    const setupMock = jest.fn();
    const globalContext = createMockContainer().context;
    const providedPilets: Array<Pilet> = [
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
    const optionsConfig: PiletOptionsConfig = {
      createApi: createMockApi,
      availablePilets: providedPilets,
      context: globalContext,
      fetchDependency: jest.fn(),
      getDependencies: jest.fn(),
      loadPilet: jest.fn(),
      requestPilets: jest.fn(() => Promise.resolve(providedPilets)),
      strategy: jest.fn(),
    };

    // Act
    const options = createPiletOptions(optionsConfig);

    // Assert
    expect(options.pilets.length).toEqual(providedPilets.length);

    if (wasUndefined) {
      process.env.DEBUG_PIRAL = undefined;
    }
  });

  it('createPiletOptions creates the options exposing the global dependencies', () => {
    // Arrange
    const setupMock = jest.fn();
    const globalContext = createMockContainer().context;
    const providedPilets: Array<Pilet> = [
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
    const optionsConfig: PiletOptionsConfig = {
      createApi: createMockApi,
      availablePilets: providedPilets,
      context: globalContext,
      fetchDependency: jest.fn(),
      getDependencies: () => globalDependencies,
      loadPilet: jest.fn(),
      requestPilets: jest.fn(() => Promise.resolve(providedPilets)),
      strategy: jest.fn(),
    };

    // Act
    const options = createPiletOptions(optionsConfig);

    // Assert
    expect(options.dependencies).toEqual(globalDependencies);
  });

  it('createPiletOptions creates the options with provided requestPilets', () => {
    const wasUndefined = process.env.DEBUG_PIRAL === undefined;

    // Arrange
    process.env.DEBUG_PIRAL = 'true';
    const setupMock = jest.fn();
    const requestPilets = jest.fn(() => Promise.resolve(providedPilets));
    const globalContext = createMockContainer().context;
    const providedPilets: Array<Pilet> = [
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
    const optionsConfig: PiletOptionsConfig = {
      createApi: createMockApi,
      availablePilets: providedPilets,
      context: globalContext,
      fetchDependency: jest.fn(),
      getDependencies: jest.fn(),
      loadPilet: jest.fn(),
      requestPilets: requestPilets,
      strategy: jest.fn(),
    };

    // Act
    const options = createPiletOptions(optionsConfig);
    options.fetchPilets();

    // Assert
    expect(requestPilets).toHaveBeenCalled();

    if (wasUndefined) {
      process.env.DEBUG_PIRAL = undefined;
    }
  });
});
