import { createPiletOptions, PiletOptionsConfig } from './helpers';
import { globalDependencies } from './modules';
import { PiletMetadata } from 'piral-base';
import { Atom, swap, deref } from '@dbeining/react-atom';

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
    registry: {
      pages: {},
      extensions: {},
      wrappers: {},
    },
    routes: {},
    components: {},
    modules: [],
  });
  return {
    context: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
      state,
      dispatch(cb) {
        swap(state, cb);
      },
      readState(cb) {
        return cb(deref(state));
      },
      setComponent(name, comp) {
        swap(state, (s) => ({
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
    const providedPilets: Array<any> = [
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
      shareDependencies: jest.fn((deps) => deps),
      context: globalContext,
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
    const providedPilets: Array<any> = [
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
      shareDependencies: jest.fn((deps) => deps),
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
    const providedPilets: Array<any> = [
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
      shareDependencies: jest.fn((deps) => deps),
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

  it('createPiletOptions runs in PILET_DEBUG context', () => {
    const wasUndefined = process.env.DEBUG_PILET === undefined;

    // Arrange
    process.env.DEBUG_PILET = 'on';
    const setupMock = jest.fn();
    window.fetch = jest.fn((_, options) =>
      Promise.resolve({
        text() {
          return Promise.resolve('This is an example response');
        },
        json() {
          return Promise.resolve(options);
        },
      }),
    ) as any;
    const requestPilets = jest.fn(() => Promise.resolve(providedPilets));
    const globalContext = createMockContainer().context;
    const providedPilets: Array<any> = [
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
      shareDependencies: jest.fn((deps) => deps),
      loadPilet: jest.fn(),
      requestPilets: requestPilets,
      strategy: jest.fn(),
    };

    let hasFailed = false;

    // Act
    const options = createPiletOptions(optionsConfig);
    try {
      options.fetchPilets(); //This call should not work in node.js test environment
    } catch {
      hasFailed = true;
    }

    // Assert
    expect(hasFailed).toBeFalsy();

    if (wasUndefined) {
      process.env.DEBUG_PILET = undefined;
    }
  });
});
