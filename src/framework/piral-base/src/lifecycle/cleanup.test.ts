import { prepareCleanup, runCleanup } from './cleanup';

describe('Cleaning up Modules', () => {
  it('cleans up stylesheet if available', () => {
    const remove = jest.fn();
    document.querySelector = jest.fn(() => ({ remove }));
    runCleanup(
      {
        name: 'my-pilet',
      } as any,
      {} as any,
      {},
    );
    expect(document.querySelector).toHaveBeenCalledWith('link[data-origin="my-pilet"]');
    expect(remove).toHaveBeenCalledTimes(1);
  });

  it('discards stylesheet if not available', () => {
    document.querySelector = jest.fn(() => null);
    runCleanup(
      {
        name: 'my-pilet',
      } as any,
      {} as any,
      {},
    );
    expect(document.querySelector).toHaveBeenCalledWith('link[data-origin="my-pilet"]');
  });

  it('runs teardown if available', () => {
    document.querySelector = jest.fn(() => null);
    const teardown = jest.fn();
    runCleanup(
      {
        name: 'my-pilet',
        teardown,
      } as any,
      {} as any,
      {},
    );
    expect(teardown).toHaveBeenCalled();
  });

  it('runs cleanupPilet hook if available', () => {
    document.querySelector = jest.fn(() => null);
    const cleanupPilet = jest.fn();
    runCleanup(
      {
        name: 'my-pilet',
      } as any,
      {} as any,
      {
        cleanupPilet
      },
    );
    expect(cleanupPilet).toHaveBeenCalled();
  });

  it('deletes require reference if available', () => {
    document.querySelector = jest.fn(() => null);
    const pilet: any = {
      name: 'my-pilet',
      requireRef: 'abc',
    };
    window['abc'] = pilet;
    runCleanup(pilet, {} as any, {});
    expect(window['abc']).toBeUndefined();
  });

  it('prepares the cleanup', () => {
    const pilet: any = {
      name: 'my-pilet',
      requireRef: 'abc',
    };
    const api: any = {
      on: jest.fn(),
      off: jest.fn(),
    };
    prepareCleanup(pilet, api, {});
    expect(api.on).toBeCalledWith('unload-pilet', expect.anything());
  });

  it('prepared cleanup function has handler that is sensitive to the name', () => {
    document.querySelector = jest.fn(() => null);
    const pilet: any = {
      name: 'my-pilet',
      requireRef: 'abc',
    };
    let handler = undefined;
    const api: any = {
      on: jest.fn((evtName, cb) => (handler = cb)),
      off: jest.fn(),
    };
    prepareCleanup(pilet, api, {});
    expect(api.on).toBeCalledWith('unload-pilet', handler);
    handler({ name: 'foo' });
    expect(api.off).not.toBeCalled();
    handler({ name: pilet.name });
    expect(api.off).toBeCalledWith('unload-pilet', handler);
  });
});
