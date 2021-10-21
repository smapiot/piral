import type { BundleHandlerResponse } from 'piral-cli';
import type { ParcelBundle } from 'parcel-bundler';
import { EventEmitter } from 'events';
import { basename, dirname } from 'path';

export function runParcel(
  bundler: any,
  postProcess: (bundle: ParcelBundle) => Promise<string>,
): Promise<BundleHandlerResponse> {
  const eventEmitter = new EventEmitter();
  const result = {
    outFile: '',
    outDir: bundler.options.outDir,
    name: '',
    hash: '',
    requireRef: undefined,
  };

  const update = async (bundle: ParcelBundle) => {
    const requireRef = await postProcess(bundle);
    const file = bundler.mainBundle.name;
    result.hash = bundler.mainBundle.entryAsset.hash;
    result.name = basename(file);
    result.outDir = dirname(file);
    result.outFile = `/${basename(file)}`;
    result.requireRef = requireRef;
  };

  bundler.on('buildStart', () => eventEmitter.emit('start'));
  bundler.on('bundled', async (bundle: ParcelBundle) => {
    await update(bundle);
    eventEmitter.emit('end', result);
  });

  return Promise.resolve({
    async bundle() {
      const bundle = await bundler.bundle();
      await update(bundle);
      return result;
    },
    onStart(cb) {
      eventEmitter.on('start', cb);
    },
    onEnd(cb) {
      eventEmitter.on('end', cb);
    },
  });
}
