import { Parcel } from '@parcel/core';
import { EventEmitter } from 'events';

interface ParcelOptions {
  watch: boolean;
  outFile: string;
  outDir: string;
}

export function runParcel(bundler: Parcel, options: ParcelOptions) {
  const eventEmitter = new EventEmitter();
  const bundle = {
    outFile: `/${options.outFile}`,
    outDir: options.outDir,
    name: options.outFile,
    requireRef: undefined,
  };

  return Promise.resolve({
    async bundle() {
      if (options.watch) {
        await bundler.watch((err, event) => {
          if (err) {
            // fatal error
            throw err;
          }

          if (event.type === 'buildSuccess') {
            // let bundles = event.bundleGraph.getBundles();
            eventEmitter.emit('end', bundle);
          } else if (event.type === 'buildFailure') {
            console.log(event.diagnostics);
          } else {
            console.log(event.type);
          }
        });
        return bundle;
      } else {
        await bundler.run();
        return bundle;
      }
    },
    onStart(cb) {
      eventEmitter.on('start', cb);
    },
    onEnd(cb) {
      eventEmitter.on('end', cb);
    },
  });
}
