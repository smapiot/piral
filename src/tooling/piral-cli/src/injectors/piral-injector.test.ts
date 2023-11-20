import PiralInjector from './piral-injector';
import { describe, it, expect } from 'vitest';
import { KrasRequest, KrasResult } from 'kras';
import { EventEmitter } from 'events';

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
      publicUrl: '/',
      active: true,
      headers: {},
    };
    const injector = new PiralInjector(config, undefined as any, new EventEmitter());
    expect(injector.active).toBeTruthy();
  });

  it('PiralInjector properties can be accessed', () => {
    // Arrange
    const config = {
      bundler: bundlerMock,
      publicUrl: '/',
      active: true,
      headers: {},
    };
    const injector = new PiralInjector(config, undefined as any, new EventEmitter());

    // Act
    injector.active = false;
    injector.name;
    injector.getOptions();
    injector.config;

    // Assert
    expect(injector.active).toBeFalsy();
  });

  it('PiralInjector can send reponse and fails with invalid path', async () => {
    // Arrange
    const config = {
      bundler: bundlerMock,
      publicUrl: '/',
      active: true,
      headers: {},
    };
    const injector = new PiralInjector(config, undefined as any, new EventEmitter());

    // Act
    const res = await injector.sendResponse('some/nice/invalid/path', 'sometarget.file', 'someDir', 'localhost:1234');

    // Assert
    expect(res).toBeUndefined();
  });

  it('PiralInjector wont crash when handling an invalid request', async () => {
    // Arrange
    const config = {
      bundler: bundlerMock,
      publicUrl: '/',
      active: true,
      headers: {},
    };
    const injector = new PiralInjector(config, undefined as any, new EventEmitter());
    const request = {
      content: 'someFakeContent',
      headers: {},
      method: 'PUT',
      query: {},
      target: '',
      url: 'localhost:1234',
    } as KrasRequest;

    // Act
    const res = await (injector.handle(request) as Promise<KrasResult>);

    // Assert
    expect(res).toBeUndefined();
  });
});
