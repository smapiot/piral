/**
 * @vitest-environment jsdom
 */
import create from 'zustand';
import { describe, it, expect, vitest } from 'vitest';
import { createPiletOptions, PiletOptionsConfig } from './helpers';
import { globalDependencies } from './modules';
import { PiletMetadata } from 'piral-base';

vitest.mock('../app.codegen', () => ({
  createNavigation: vitest.fn(() => ({
    publicPath: '/',
  })),
  fillDependencies: vitest.fn(),
  integrateDebugger: vitest.fn(),
  integrateEmulator: vitest.fn(),
  publicPath: '/',
  useRouteFilter(routes) {
    return routes;
  },
  createDefaultState() {
    return {};
  },
}));

function createMockApi(meta: PiletMetadata) {
  return {
    meta,
    emit: vitest.fn(),
    off: vitest.fn(),
    on: vitest.fn(),
  } as any;
}

function createMockContainer() {
  const state = create(() => ({
    registry: {
      pages: {},
      extensions: {},
      wrappers: {},
    },
    routes: {},
    components: {},
    modules: [],
  }));
  return {
    context: {
      on: vitest.fn(),
      off: vitest.fn(),
      emit: vitest.fn(),
      state,
      dispatch(cb) {
        state.setState(cb(state.getState()));
      },
      readState(cb) {
        return cb(state.getState());
      },
      setComponent(name, comp) {
        const s = state.getState();
        state.setState({
          ...s,
          components: {
            ...s.components,
            [name]: comp,
          },
        });
      },
    } as any,
  };
}

describe('Piral-Core helpers module', () => {
  it('createPiletOptions creates the options using the provided pilets', () => {
    const wasUndefined = process.env.DEBUG_PIRAL === undefined;

    process.env.DEBUG_PIRAL = 'true';

    // Arrange
    const setupMock = vitest.fn();
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
      shareDependencies: vitest.fn((deps) => deps),
      context: globalContext,
      loadPilet: vitest.fn(),
      requestPilets: vitest.fn(() => Promise.resolve(providedPilets)),
      strategy: vitest.fn(),
    };

    // Act
    const options = createPiletOptions(optionsConfig);

    // Assert
    expect(options.pilets?.length).toEqual(providedPilets.length);

    if (wasUndefined) {
      process.env.DEBUG_PIRAL = undefined;
    }
  });

  it('createPiletOptions creates the options exposing the global dependencies', () => {
    // Arrange
    const setupMock = vitest.fn();
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
      shareDependencies: vitest.fn((deps) => deps),
      loadPilet: vitest.fn(),
      requestPilets: vitest.fn(() => Promise.resolve(providedPilets)),
      strategy: vitest.fn(),
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
    const setupMock = vitest.fn();
    const requestPilets = vitest.fn(() => Promise.resolve(providedPilets));
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
      shareDependencies: vitest.fn((deps) => deps),
      loadPilet: vitest.fn(),
      requestPilets: requestPilets,
      strategy: vitest.fn(),
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
    const setupMock = vitest.fn();
    window.fetch = vitest.fn((_, options) =>
      Promise.resolve({
        text() {
          return Promise.resolve('This is an example response');
        },
        json() {
          return Promise.resolve(options);
        },
      }),
    ) as any;
    const requestPilets = vitest.fn(() => Promise.resolve(providedPilets));
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
      shareDependencies: vitest.fn((deps) => deps),
      loadPilet: vitest.fn(),
      requestPilets: requestPilets,
      strategy: vitest.fn(),
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
