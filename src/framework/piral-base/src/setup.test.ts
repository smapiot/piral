import { setupSinglePilet } from './setup';

describe('Setting up Modules', () => {
  it('works if setup is available', () => {
    const setupMock = jest.fn();
    console.error = jest.fn();
    const api = {};
    setupSinglePilet(
      {
        setup: setupMock,
      } as any,
      api,
    );
    expect(setupMock).toHaveBeenCalledWith(api);
    expect(console.error).toHaveBeenCalledTimes(0);
  });

  it('emits error but does not crash if setup crashes', () => {
    const setupMock = jest.fn();
    console.error = jest.fn();
    const api = {};
    setupSinglePilet(
      {
        setup(api) {
          setupMock(api);
          throw new Error('Did something stupid');
          setupMock(api);
        },
      } as any,
      api,
    );
    expect(setupMock).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  it('emits error but does not crash if no setup is available', () => {
    const setupMock = jest.fn();
    console.error = jest.fn();
    const api = {};
    setupSinglePilet({} as any, api);
    expect(setupMock).toHaveBeenCalledTimes(0);
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  it('emits error but does not crash if no module is available', () => {
    const setupMock = jest.fn();
    console.error = jest.fn();
    const api = {};
    setupSinglePilet(undefined as any, api);
    expect(setupMock).toHaveBeenCalledTimes(0);
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  it('emits error but does not crash if wrong type supplied', () => {
    const setupMock = jest.fn();
    console.error = jest.fn();
    const api = {};
    setupSinglePilet((() => {}) as any, api);
    expect(setupMock).toHaveBeenCalledTimes(0);
    expect(console.error).toHaveBeenCalledTimes(1);
  });
});
