/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import { getDataExpiration, createDataOptions, createDataView } from './data';
import { Dict, SharedDataItem } from '../types';

describe('Data Module', () => {
  it('getDataExpiration handles never like -1', () => {
    const result = getDataExpiration('never');
    expect(result).toBe(-1);
  });

  it('getDataExpiration handles numbers directly', () => {
    const num = 17;
    const result = getDataExpiration(num);
    expect(result).toBe(num);
  });

  it('getDataExpiration converts Date to number', () => {
    const num = 28;
    const result = getDataExpiration(new Date(num));
    expect(result).toBe(num);
  });

  it('getDataExpiration converts unknown input to -1', () => {
    const result = getDataExpiration([] as any);
    expect(result).toBe(-1);
  });

  it('createDataOptions can be used with no argument', () => {
    const options = createDataOptions();
    expect(options).toEqual({
      target: 'memory',
    });
  });

  it('createDataOptions can be used with a string target', () => {
    const options = createDataOptions('remote');
    expect(options).toEqual({
      target: 'remote',
    });
  });

  it('createDataOptions can be used with a filled object', () => {
    const options = createDataOptions({
      target: 'local',
    });
    expect(options).toEqual({
      target: 'local',
    });
  });

  it('createDataOptions can be used with an unfilled object', () => {
    const options = createDataOptions({});
    expect(options).toEqual({});
  });

  it('createDataOptions can be used with anything like a function', () => {
    const options = createDataOptions(function () {} as any);
    expect(options).toEqual({
      target: 'memory',
    });
  });

  it('createDataOptions can be used with anything like an array', () => {
    const options = createDataOptions([] as any);
    expect(options).toEqual({
      target: 'memory',
    });
  });

  it('createDataView returns undefined if not supported', () => {
    const proxyName = 'Proxy';
    const Proxy = window[proxyName];
    // @ts-ignore
    window[proxyName] = undefined;
    const view = createDataView({});
    window[proxyName] = Proxy;
    expect(view).toBe(undefined);
  });

  it('createDataView silently ignores writing to nothing', () => {
    const data: Dict<SharedDataItem> = {};
    const view = createDataView(data);
    (view as any).foo = 5;
    expect(view.foo).toBe(undefined);
  });

  it('createDataView allows reading to the underlying value', () => {
    const data: Dict<SharedDataItem> = {
      foo: {
        expires: -1,
        owner: 'foo',
        target: 'memory',
        value: 5,
      },
    };
    const view = createDataView(data);
    expect(view.foo).toBe(5);
  });

  it('createDataView silently ignores writing to value', () => {
    const data: Dict<SharedDataItem> = {
      foo: {
        expires: -1,
        owner: 'foo',
        target: 'memory',
        value: 10,
      },
    };
    const view = createDataView(data);
    (view as any).foo = 5;
    expect(view.foo).toBe(10);
  });
});
