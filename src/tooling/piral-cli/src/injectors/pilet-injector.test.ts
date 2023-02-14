jest.mock('../external', () => ({
  jju: {
    parse: () => ({
      custom: 'mockCustom',
      piletConfig: {},
      name: 'mockName',
      version: 'mockVersion',
    }),
  },
  ora() {},
  rc() {},
}));

jest.mock('fs', () => ({
  readFileSync() {},
  existsSync() {},
}));

jest.mock('path', () => ({ join() {} }));

import { EventEmitter } from 'events';
import { KrasRequest } from 'kras';
import { Bundler } from '../types';
import PiletInjector from './pilet-injector';

const optionsMock = {
  pilets: [],
  publicUrl: '/',
  api: '',
  app: '',
  active: true,
  meta: '',
  headers: {},
};

const configMock: any = {
  port: 1234,
};

describe('Piral-CLI pilet injector', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('PiletInjector is active when configured', () => {
    const core = new EventEmitter();
    const injector = new PiletInjector(optionsMock, configMock, core);
    expect(injector.active).toBeTruthy();
  });

  it('PiletInjector properties can be accessed', () => {
    // Arrange
    const core = new EventEmitter();
    const injector = new PiletInjector(optionsMock, configMock, core);

    // Act
    injector.active = false;
    injector.name;
    injector.getOptions();
    //injector.getMetaOf(0);
    injector.getIndexMeta('http://localhost:9000');

    // Assert
    expect(injector.active).toBeFalsy();
  });

  it('PiletInjector does not send empty content', () => {
    // Arrange
    const core = new EventEmitter();
    const injector = new PiletInjector(optionsMock, configMock, core);
    const target = '';
    const url = '';

    let hasFailed = false;

    // Act
    try {
      injector.sendFile(target, url); // this file does not exist
    } catch {
      hasFailed = true;
    }
    // Assert
    expect(hasFailed).toBeTruthy();
  });

  it('PiletInjector does not crash when sending invalid content', () => {
    // Arrange
    const core = new EventEmitter();
    const injector = new PiletInjector(optionsMock, configMock, core);

    // Act
    const res = injector.sendContent('someContent', 'application/json', 'invalidUrl');

    // Assert
    expect(res).not.toBeUndefined();
  });

  it('PiletInjector can send response and fails with invalid path', async () => {
    // Arrange
    const core = new EventEmitter();
    const injector = new PiletInjector(optionsMock, configMock, core);

    // Act
    const res = await injector.sendResponse('some/nice/invalid/path', 'localhost:1234', 'http://localhost:9000');

    // Assert
    expect(res).toBeUndefined();
  });

  it('PiletInjector wont crash on mocked request', async () => {
    // Arrange
    const optionsMock = {
      pilets: [],
      api: 'http://someFakeApi:1234',
      app: '',
      publicUrl: '/',
      meta: '',
      headers: {},
      active: true,
    };

    const core = new EventEmitter();
    const injector = new PiletInjector(optionsMock, configMock, core);
    const request: KrasRequest = {
      content: 'someFakeContent',
      headers: {},
      method: 'PUT',
      query: {},
      target: optionsMock.api,
      url: 'localhost:1234',
    };

    // Act
    const res = await injector.handle(request);

    // Assert
    expect(res).toBeUndefined();
  });

  it('PiletInjector wont crash on request with no target', () => {
    // Arrange
    const optionsMock = {
      pilets: [],
      api: 'http://someFakeApi:1234',
      app: '',
      publicUrl: '/',
      meta: '',
      headers: {},
      active: true,
    };
    const core = new EventEmitter();
    const injector = new PiletInjector(optionsMock, configMock, core);
    const request: KrasRequest = {
      content: 'someFakeContent',
      headers: {},
      method: 'PUT',
      query: {},
      target: '',
      url: 'localhost:1234',
    };

    // Act
    const res = injector.handle(request);

    // Assert
    expect(res).toBeUndefined();
  });

  it('PiletInjector piletmeta fetch reads baseUrl from assetBaseUrl in config', () => {
    // Arrange
    const requestOrigin = 'http://somehosturl.local';
    const assetBaseUrl = 'http://configDefinedBaseAsseturl:4321';
    let bundlerCallback;
    function storeBundlerCallback(callback: (...args) => void) {
      bundlerCallback = callback;
    }
    const getPiletApiSpy = jest.spyOn(PiletInjector.prototype, 'getPiletApi');
    const optionsMock = {
      pilets: [
        {
          bundler: { on: storeBundlerCallback, bundle: { name: 'mockBundle' } } as Bundler,
          root: 'foobar',
          getMeta: (_baseUrl: string) => ({ name: 'my-fake-pilet' }),
        },
      ],
      api: 'http://someFakeApi:1234',
      app: '',
      publicUrl: '/',
      meta: '',
      headers: {},
      active: true,
    };
    const core = new EventEmitter();
    new PiletInjector({ ...optionsMock, assetBaseUrl }, configMock, core);

    // Act
    core.emit('user-connected', {
      target: '*',
      url: 'ttp://someFakeApi:1234',
      id: 'fooId',
      req: { headers: { origin: requestOrigin } },
      ws: { send: () => {} },
    });
    bundlerCallback();

    //Assert
    expect(getPiletApiSpy).toHaveBeenCalledWith(assetBaseUrl);
  });

  it('PiletInjector piletmeta fetch reads baseUrl from headers origin if assetBaseUrl config is not defined', () => {
    // Arrange
    const requestOrigin = 'http://somehosturl.local';
    let bundlerCallback;
    function storeBundlerCallback(callback: (...args) => void) {
      bundlerCallback = callback;
    }
    const getPiletApiSpy = jest.spyOn(PiletInjector.prototype, 'getPiletApi');
    const optionsMock = {
      pilets: [
        {
          bundler: { on: storeBundlerCallback, bundle: { name: 'mockBundle' } } as Bundler,
          root: 'foobar',
          getMeta: (_baseUrl: string) => ({ name: 'my-fake-pilet' }),
        },
      ],
      api: 'http://someFakeApi:1234',
      app: '',
      publicUrl: '/',
      meta: '',
      headers: {},
      active: true,
    };
    const core = new EventEmitter();
    new PiletInjector(optionsMock, configMock, core);

    // Act
    core.emit('user-connected', {
      target: '*',
      url: 'ttp://someFakeApi:1234',
      id: 'fooId',
      req: { headers: { origin: requestOrigin } },
      ws: { send: () => {} },
    });
    bundlerCallback();

    //Assert
    expect(getPiletApiSpy).toHaveBeenCalledWith(requestOrigin);
  });
});
