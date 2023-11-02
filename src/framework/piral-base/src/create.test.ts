import 'systemjs/dist/system.js';
import 'systemjs/dist/extras/named-register.js';

import { describe, it, expect, vitest } from 'vitest';
import { startLoadingPilets } from './create';

describe('Piral-Base create module', () => {
  it('startLoadingPilets triggers the selected strategy', async () => {
    const reporter = vitest.fn();
    const loading = startLoadingPilets({
      createApi() {
        return undefined;
      },
      fetchPilets() {
        return Promise.resolve([]);
      },
      strategy(opts, pilets) {
        return Promise.resolve();
      },
    });
    loading.connect(reporter);
    expect(reporter).toHaveBeenCalledTimes(1);
    expect(reporter).toHaveBeenLastCalledWith(undefined, [], false);
    await new Promise(process.nextTick);
    expect(reporter).toHaveBeenCalledTimes(2);
    expect(reporter).toHaveBeenLastCalledWith(undefined, [], true);
  });

  it('startLoadingPilets without proper notifier', async () => {
    const loading = startLoadingPilets({
      createApi() {
        return undefined;
      },
      fetchPilets() {
        return Promise.resolve([]);
      },
      strategy(opts, pilets) {
        return Promise.resolve();
      },
    });
    loading.connect(true as any);
  });

  it('startLoadingPilets disconnects properly', async () => {
    const reporter = vitest.fn();
    const loading = startLoadingPilets({
      createApi() {
        return undefined;
      },
      fetchPilets() {
        return Promise.resolve([]);
      },
      strategy(opts, pilets) {
        return Promise.resolve();
      },
    });
    loading.connect(reporter);
    loading.disconnect(reporter);
    await new Promise(process.nextTick);
    expect(reporter).toHaveBeenCalledTimes(1);
  });

  it('startLoadingPilets with a failing strategy', async () => {
    const reporter = vitest.fn();
    const err = new Error('Failed to load');
    const loading = startLoadingPilets({
      createApi() {
        return undefined;
      },
      fetchPilets() {
        return Promise.resolve([]);
      },
      strategy(opts, pilets) {
        pilets(err, []);
        return Promise.resolve();
      },
    });
    loading.connect(reporter);
    expect(reporter).toHaveBeenCalledTimes(1);
    expect(reporter).toHaveBeenLastCalledWith(err, [], false);
    await new Promise(process.nextTick);
    expect(reporter).toHaveBeenCalledTimes(2);
    expect(reporter).toHaveBeenLastCalledWith(err, [], true);
  });

  it('startLoadingPilets with some delivered pilets', async () => {
    const reporter = vitest.fn();
    const pilet1: any = {};
    const pilet2: any = {};
    const pilet3: any = {};
    const loading = startLoadingPilets({
      createApi() {
        return undefined;
      },
      fetchPilets() {
        return Promise.resolve([]);
      },
      strategy(opts, pilets) {
        pilets(undefined, [pilet1, pilet2]);
        return Promise.resolve()
          .then(() => pilets(undefined, [pilet1, pilet2, pilet3]))
          .then(() => {});
      },
    });
    loading.connect(reporter);
    expect(reporter).toHaveBeenCalledTimes(1);
    expect(reporter).toHaveBeenLastCalledWith(undefined, [pilet1, pilet2], false);
    await new Promise(process.nextTick);
    expect(reporter).toHaveBeenCalledTimes(3);
    expect(reporter).toHaveBeenLastCalledWith(undefined, [pilet1, pilet2, pilet3], true);
  });

  it('startLoadingPilets triggers the standard strategy', async () => {
    const reporter = vitest.fn();
    const loading = startLoadingPilets({
      createApi() {
        return undefined;
      },
      fetchPilets() {
        return Promise.resolve([]);
      },
    });
    loading.connect(reporter);
    expect(reporter).toHaveBeenCalledTimes(1);
    expect(reporter).toHaveBeenLastCalledWith(undefined, [], false);
    await new Promise(process.nextTick);
    expect(reporter).toHaveBeenCalledTimes(3);
    expect(reporter).toHaveBeenLastCalledWith(undefined, [], true);
  });
});
