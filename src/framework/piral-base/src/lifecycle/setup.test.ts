import { setupSinglePilet, setupPiletBundle } from './setup';

describe('Setting up Modules', () => {
  it('works if single setup is available', () => {
    const setupMock = jest.fn();
    console.error = jest.fn();
    const api = {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
      meta: {} as any,
    };
    setupSinglePilet(
      {
        setup: setupMock,
      } as any,
      () => api,
      {},
    );
    expect(setupMock).toHaveBeenCalledWith(api);
    expect(console.error).toHaveBeenCalledTimes(0);
  });

  it('emits error but does not crash if setup crashes for single', () => {
    const setupMock = jest.fn();
    console.error = jest.fn();
    const api = {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
      meta: {} as any,
    };
    setupSinglePilet(
      {
        setup(api) {
          setupMock(api);
          throw new Error('Did something stupid');
          setupMock(api);
        },
      } as any,
      () => api,
      {},
    );
    expect(setupMock).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  it('emits error but does not crash if no setup is available for single', () => {
    const setupMock = jest.fn();
    console.error = jest.fn();
    const api = {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
      meta: {} as any,
    };
    setupSinglePilet({} as any, () => api, {});
    expect(setupMock).toHaveBeenCalledTimes(0);
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  it('emits error but does not crash if no module is available for single', () => {
    const setupMock = jest.fn();
    console.error = jest.fn();
    const api = {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
      meta: {} as any,
    };
    setupSinglePilet(undefined as any, () => api, {});
    expect(setupMock).toHaveBeenCalledTimes(0);
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  it('emits error but does not crash if wrong type supplied for single', () => {
    const setupMock = jest.fn();
    console.error = jest.fn();
    const api = {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
      meta: {} as any,
    };
    setupSinglePilet((() => {}) as any, () => api, {});
    expect(setupMock).toHaveBeenCalledTimes(0);
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  it('works if multi setup is available', () => {
    const setupMock = jest.fn();
    console.error = jest.fn();
    const api = {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
      meta: {} as any,
    };
    const factory = () => api;
    setupPiletBundle(
      {
        setup: setupMock,
      } as any,
      factory,
      {},
    );
    expect(setupMock).toHaveBeenCalledWith(factory);
    expect(console.error).toHaveBeenCalledTimes(0);
  });

  it('emits error but does not crash if setup crashes for bundle', () => {
    const setupMock = jest.fn();
    console.error = jest.fn();
    const api = {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
      meta: {} as any,
    };
    setupPiletBundle(
      {
        setup(api) {
          setupMock(api);
          throw new Error('Did something stupid');
          setupMock(api);
        },
      } as any,
      () => api,
      {},
    );
    expect(setupMock).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  it('emits error but does not crash if no setup is available for bundle', () => {
    const setupMock = jest.fn();
    console.error = jest.fn();
    const api = {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
      meta: {} as any,
    };
    setupPiletBundle({} as any, () => api, {});
    expect(setupMock).toHaveBeenCalledTimes(0);
    expect(console.error).toHaveBeenCalledTimes(1);
  });
});
