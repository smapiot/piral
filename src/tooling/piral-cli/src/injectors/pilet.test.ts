import { EventEmitter } from 'events';
import { KrasRequest } from 'kras';
import PiletInjector from './pilet';

const optionsMock = {
  pilets: [],
  api: '',
  app: '',
  active: true,
};

const configMock: any = {
  port: 1234,
};

describe('Piral-CLI piral injector', () => {
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
    injector.getMeta();

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
    const res = await injector.sendResponse('some/nice/invalid/path', 'localhost:1234');

    // Assert
    expect(res).toBeUndefined();
  });

  it('PiletInjector wont crash on mocked request', async () => {
    // Arrange
    const optionsMock = {
      pilets: [],
      api: 'http://someFakeApi:1234',
      app: '',
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
});
