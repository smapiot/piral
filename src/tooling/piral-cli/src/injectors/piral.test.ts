import PiralInjector, { PiralInjectorConfig } from './piral';
import { KrasRequest, KrasResult } from 'kras';

const bundlerMock = {
  pending: true,
  bundle: {
    dir: '',
    hash: '',
    name: 'someName',
  },
  on() {},
  off() {},
  start() {},
  ready() {
    return Promise.resolve();
  },
};

describe('Piral-CLI piral injector', () => {
  it('PiralInjector is active when configured', () => {
    const bundler = {
      pending: true,
      bundle: {
        dir: '',
        hash: '',
        name: '',
      },
      on() {},
      off() {},
      start() {},
      ready() {
        return Promise.resolve();
      },
    };
    const config = {
      bundler,
      active: true,
    };
    const injector = new PiralInjector(config);
    expect(injector.active).toBeTruthy();
  });

  it('PiralInjector properties can be accessed', () => {
    // Arrange
    const config = {
      bundler: bundlerMock,
      active: true,
    };
    const injector = new PiralInjector(config);

    // Act
    injector.active = false;
    injector.name;
    injector.getOptions();
    injector.config;

    // Assert
    expect(injector.active).toBeFalsy();
  });

  it('PiralInjector can send reponse and fails with invalid path', () => {
    // Arrange
    const config = {
      bundler: bundlerMock,
      active: true,
    };
    const injector = new PiralInjector(config);

    // Act
    const res = injector.sendResponse('some/nice/invalid/path', 'sometarget.file', 'someDir', 'localhost:1234');

    // Assert
    expect(res).toBeUndefined();
  });

  it('PiralInjector wont crash when handling an invalid request', async () => {
    // Arrange
    const config = {
      bundler: bundlerMock,
      active: true,
    };
    const injector = new PiralInjector(config);
    const request: KrasRequest = {
      content: 'someFakeContent',
      headers: {},
      method: 'PUT',
      query: {},
      target: '',
      url: 'localhost:1234',
    };

    // Act
    const res = await (injector.handle(request) as Promise<KrasResult>);

    // Assert
    expect(res).toBeUndefined();
  });
});
