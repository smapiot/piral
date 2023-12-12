import { describe, it, expect, vitest } from 'vitest';
import {
  setBundler,
  callPiletBuild,
  callPiletDebug,
  callPiralBuild,
  callPiralDebug,
  callDebugPiralFromMonoRepo,
} from './bundler';
import { callDynamic, callStatic } from './build/bundler-calls';
import * as common from './common';

const defaults = {
  bundler: false,
};

vitest.mock('./build/bundler-calls.ts', () => ({
  callDynamic: vitest.fn(() =>
    Promise.resolve({
      bundle: {},
    }),
  ),
  callStatic: vitest.fn(() =>
    Promise.resolve({
      bundle: {},
    }),
  ),
}));

vitest.mock('./inject', () => ({
  inject() {
    if (defaults.bundler) {
      setBundler({
        name: 'default',
        actions: {
          buildPilet: { path: '' },
          debugPilet: { path: '' },
          buildPiral: { path: '' },
          debugPiral: { path: '' },
          watchPiral: { path: '' },
        } as any,
      });
    }
  },
}));

vitest.mock('./common', () => ({
  config: {
    bundler: 'parcel',
  },
  promptSelect(msg, choices, defval) {
    return Promise.resolve(defval);
  },
  compatVersion: '1',
  installNpmPackage: vitest.fn(),
  fail(msg) {
    throw new Error(msg);
  },
  progress() {},
  log() {},
  determineNpmClient() {
    return 'npm';
  },
  patchModules: vitest.fn(),
  logReset() {},
}));

describe('Piral CLI Bundler Module', () => {
  it('fails if no default bundler can be installed, but required', async () => {
    defaults.bundler = false;
    return expect(callPiletBuild({ root: undefined } as any)).rejects.toThrow();
  });

  it('using no bundler installs a bundler if none available', async () => {
    defaults.bundler = true;
    return expect(callPiletBuild({ root: undefined } as any)).resolves.not.toThrow();
  });

  it('setting the bundler can resolve it properly for call pilet build', async () => {
    const actions = {
      buildPilet: { path: '1' },
      debugPilet: { path: '2' },
      buildPiral: { path: '3' },
      debugPiral: { path: '4' },
      watchPiral: { path: '5' },
    };

    setBundler({
      name: 'foo1',
      actions: actions as any,
    });

    const args = { root: undefined };
    await callPiletBuild(args as any, 'foo1');
    expect(callStatic).toHaveBeenCalledWith('build-pilet', '1', args, undefined);
  });

  it('setting the bundler with optimize modules calls optimize modules', async () => {
    const actions = {
      buildPilet: { path: '' },
      debugPilet: { path: '' },
      buildPiral: { path: '' },
      debugPiral: { path: '' },
      watchPiral: { path: '' },
    };

    setBundler({
      name: 'bar1',
      actions: actions as any,
    });

    await callPiletBuild({ root: undefined, optimizeModules: true } as any, 'bar1');
    expect(common.patchModules).toHaveBeenCalled();
  });

  it('using no bundler uses the first bundler when available', async () => {
    const result = await callPiletBuild({ root: undefined, optimizeModules: false } as any);
    expect(result).not.toBeUndefined();
  });

  it('setting the bundler can resolve it properly for call piral build', async () => {
    const actions = {
      buildPilet: { path: '1' },
      debugPilet: { path: '2' },
      buildPiral: { path: '3' },
      debugPiral: { path: '4' },
      watchPiral: { path: '5' },
    };

    setBundler({
      name: 'foo2',
      actions: actions as any,
    });

    const args = { root: undefined };
    await callPiralBuild(args as any, 'foo2');
    expect(callStatic).toHaveBeenCalledWith('build-piral', '3', args, undefined);
  });

  it('setting the bundler can resolve it properly for call pilet debug', async () => {
    const actions = {
      buildPilet: { path: '0' },
      debugPilet: { path: '1' },
      buildPiral: { path: '2' },
      debugPiral: { path: '3' },
      watchPiral: { path: '4' },
    };

    setBundler({
      name: 'foo3',
      actions: actions as any,
    });

    const args = { root: undefined };
    await callPiletDebug(args as any, 'foo3');
    expect(callDynamic).toHaveBeenCalledWith('debug-pilet', '1', args, undefined);
  });

  it('setting the bundler can resolve it properly for call piral debug', async () => {
    const actions = {
      buildPilet: { path: '7' },
      debugPilet: { path: '8' },
      buildPiral: { path: '9' },
      debugPiral: { path: '10' },
      watchPiral: { path: '11' },
    };

    setBundler({
      name: 'foo4',
      actions: actions as any,
    });

    const args = { root: undefined };
    await callPiralDebug(args as any, 'foo4');
    expect(callDynamic).toHaveBeenCalledWith('debug-piral', '10', args, undefined);
  });

  it('setting the bundler can resolve it properly for call piral watch', async () => {
    const actions = {
      buildPilet: { path: '3' },
      debugPilet: { path: '4' },
      buildPiral: { path: '5' },
      debugPiral: { path: '6' },
      watchPiral: { path: '7' },
    };

    setBundler({
      name: 'foo5',
      actions: actions as any,
    });

    const args = { root: undefined };
    await callDebugPiralFromMonoRepo(args as any, 'foo5');
    expect(callStatic).toHaveBeenCalledWith('debug-mono-piral', '7', args, undefined);
  });

  it('using a non-available bundler should fail', () => {
    return expect(callDebugPiralFromMonoRepo({ root: undefined } as any, 'qxz')).rejects.toThrow();
  });
});
