import PiletInjector from './pilet';
import { EventEmitter } from 'events';
import { KrasRequest } from 'kras';

const configMock = {
  pilets: [],
  port: 1234,
  api: '',
  app: '',
  active: true,
};

describe('Piral-CLI piral injector', () => {
  it('PiletInjector is active when configured', () => {
    const core = new EventEmitter();
    const injector = new PiletInjector(configMock, undefined, core);
    expect(injector.active).toBeTruthy();
  });

  it('PiletInjector properties can be accessed', () => {
    // Arrange
    const core = new EventEmitter();
    const injector = new PiletInjector(configMock, undefined, core);

    // Act
    injector.active = false;
    injector.name;
    injector.getOptions();
    //injector.getMetaOf(0);
    injector.getMeta();

    // Assert
    expect(injector.active).toBeFalsy();
  });

  it('PiletInjector does not send empty content', () => {
    // Arrange
    const core = new EventEmitter();
    const injector = new PiletInjector(configMock, undefined, core);
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
    const injector = new PiletInjector(configMock, undefined, core);

    // Act
    const res = injector.sendContent('someContent', 'application/json', 'invalidUrl');

    // Assert
    expect(res).not.toBeUndefined();
  });

  it('PiletInjector can send reponse and fails with invalid path', () => {
    // Arrange
    const core = new EventEmitter();
    const injector = new PiletInjector(configMock, undefined, core);

    // Act
    const res = injector.sendResponse('some/nice/invalid/path', 'localhost:1234');

    // Assert
    expect(res).toBeUndefined();
  });

  it('PiletInjector wont crash on mocked request', () => {
    // Arrange
    const config = {
      pilets: [],
      port: 1234,
      api: 'http://someFakeApi:1234',
      app: '',
      active: true,
    };

    const core = new EventEmitter();
    const injector = new PiletInjector(config, undefined, core);
    const request: KrasRequest = {
      content: 'someFakeContent',
      headers: {},
      method: 'PUT',
      query: {},
      target: config.api,
      url: 'localhost:1234',
    };

    // Act
    const res = injector.handle(request);

    // Assert
    expect(res).toBeUndefined();
  });

  it('PiletInjector wont crash on request with no target', () => {
    // Arrange
    const config = {
      pilets: [],
      port: 1234,
      api: 'http://someFakeApi:1234',
      app: '',
      active: true,
    };
    const core = new EventEmitter();
    const injector = new PiletInjector(config, undefined, core);
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
});
