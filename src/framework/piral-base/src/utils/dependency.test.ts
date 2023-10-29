/**
 * @vitest-environment jsdom
 */
import 'systemjs/dist/system.js';
import 'systemjs/dist/extras/named-register.js';

import { describe, it, expect, vitest } from 'vitest';
import { emptyApp } from './empty';
import {
  checkPiletApp,
  checkPiletAppAsync,
  includeScript,
  includeScriptDependency,
  createEvaluatedPilet,
  checkCreateApi,
} from './dependency';

describe('dependency utility module', () => {
  it('emptyApp just works', () => {
    expect(typeof emptyApp.setup).toBe('function');
    emptyApp.setup();
  });

  it('checkPiletApp returns app if it contains a setup function', () => {
    const app = { setup: vitest.fn() };
    const result = checkPiletApp('foo', app);
    expect(result).toBe(app);
  });

  it('checkPiletApp returns new app if it does not contain a setup function', () => {
    const app = { setup: 'fool' };
    const result = checkPiletApp('foo', app as any);
    expect(result).not.toBe(app);
    expect(typeof result.setup).toBe('function');
  });

  it('checkPiletApp returns new app if it does not contain anything', () => {
    const app = {};
    const result = checkPiletApp('foo', app as any);
    expect(result).not.toBe(app);
    expect(typeof result.setup).toBe('function');
  });

  it('checkPiletApp returns new app if it is undefined', () => {
    const result = checkPiletApp('foo');
    expect(typeof result.setup).toBe('function');
  });

  it('checkPiletAppAsync returns app if it contains a setup function', async () => {
    const app = { setup: vitest.fn() };
    const result = await checkPiletAppAsync('foo', app);
    expect(result).toBe(app);
  });

  it('checkPiletAppAsync returns loading app if it contains a setup function', async () => {
    const app = { setup: vitest.fn() };
    const result = await checkPiletAppAsync('foo', Promise.resolve(app));
    expect(result).toBe(app);
  });

  it('includeScriptDependency attaches a script to the DOM that resolves', async () => {
    const mockScript: any = {};
    document.createElement = vitest.fn(() => mockScript);
    document.body.appendChild = vitest.fn(() => mockScript.onload());
    const result = await includeScriptDependency('foo');
    expect(document.body.appendChild).toHaveBeenCalledWith(mockScript);
    expect(result).toBe(mockScript);
  });

  it('includeScriptDependency attaches a script to the DOM that resolves with integrity', async () => {
    const mockScript: any = {};
    document.createElement = vitest.fn(() => mockScript);
    document.body.appendChild = vitest.fn(() => mockScript.onload());
    const result = await includeScriptDependency('foo', 'sha512-...');
    expect(document.body.appendChild).toHaveBeenCalledWith(mockScript);
    expect(result).toEqual({
      ...mockScript,
      async: true,
      integrity: 'sha512-...',
      crossOrigin: 'anonymous',
      onerror: expect.anything(),
      onload: expect.anything(),
      src: 'foo',
    });
  });

  it('includeScriptDependency attaches a script to the DOM that resolves with integrity and explicit cross-origin', async () => {
    const mockScript: any = {};
    document.createElement = vitest.fn(() => mockScript);
    document.body.appendChild = vitest.fn(() => mockScript.onload());
    const result = await includeScriptDependency('foo', 'sha512-...', 'bar');
    expect(document.body.appendChild).toHaveBeenCalledWith(mockScript);
    expect(result).toEqual({
      ...mockScript,
      async: true,
      integrity: 'sha512-...',
      crossOrigin: 'bar',
      onerror: expect.anything(),
      onload: expect.anything(),
      src: 'foo',
    });
  });

  it('includeScriptDependency attaches a script to the DOM that resolves with cross-origin', async () => {
    const mockScript: any = {};
    document.createElement = vitest.fn(() => mockScript);
    document.body.appendChild = vitest.fn(() => mockScript.onload());
    const result = await includeScriptDependency('foo', undefined, 'bar');
    expect(document.body.appendChild).toHaveBeenCalledWith(mockScript);
    expect(result).toEqual({
      ...mockScript,
      async: true,
      crossOrigin: 'bar',
      onerror: expect.anything(),
      onload: expect.anything(),
      src: 'foo',
    });
  });

  it('includeScriptDependency attaches a script to the DOM which fails', async () => {
    const mockScript: any = {};
    document.createElement = vitest.fn(() => mockScript);
    document.body.appendChild = vitest.fn(() => mockScript.onerror('errored'));

    const action = () => includeScriptDependency('foo');
    await expect(action()).rejects.toMatch('errored');
    expect(document.body.appendChild).toHaveBeenCalledWith(mockScript);
  });

  it('includeScript works like includeScriptDependency but also checks the pilet app', async () => {
    const mockScript: any = {};
    document.createElement = vitest.fn(() => mockScript);
    document.body.appendChild = vitest.fn(() => mockScript.onload());
    const result = await includeScript('abc', 'foo');
    expect(document.body.appendChild).toHaveBeenCalledWith(mockScript);
    expect(result).toBe(undefined);
  });

  it('includeScript works like includeScriptDependency but also checks the pilet app', async () => {
    const mockScript: any = {
      app: {
        setup: vitest.fn(),
      },
    };
    document.createElement = vitest.fn(() => mockScript);
    document.body.appendChild = vitest.fn(() => mockScript.onload());
    const result = await includeScript('abc', 'foo');
    expect(document.body.appendChild).toHaveBeenCalledWith(mockScript);
    expect(result.setup).toBe(mockScript.app.setup);
  });

  it('includeScript attaches a script to the DOM which fails', async () => {
    const mockScript: any = {};
    document.createElement = vitest.fn(() => mockScript);
    document.body.appendChild = vitest.fn(() => mockScript.onerror('errored'));

    await expect(includeScript('abc', 'foo')).rejects.toEqual('errored');
  });

  it('createEvaluatedPilet combines valid meta and empty app', () => {
    const meta: any = { foo: 'bar' };
    const result = createEvaluatedPilet(meta, {});
    expect(result).toEqual({
      basePath: undefined,
      foo: 'bar',
      setup: expect.anything(),
    });
  });

  it('createEvaluatedPilet combines empty meta and empty app', () => {
    const meta: any = {};
    const result = createEvaluatedPilet(meta, {});
    expect(result).toEqual({
      basePath: undefined,
      setup: expect.anything(),
    });
  });

  it('createEvaluatedPilet combines empty meta and valid app', () => {
    const meta: any = {};
    const setup = vitest.fn();
    const result = createEvaluatedPilet(meta, { setup });
    expect(result).toEqual({
      basePath: undefined,
      setup,
    });
  });

  it('checkCreateApi does work with a provided function', () => {
    const result = checkCreateApi(vitest.fn() as any);
    expect(result).toBe(true);
  });

  it('checkCreateApi does not work without a provided function', () => {
    const result = checkCreateApi('foo' as any);
    expect(result).toBe(false);
  });
});
