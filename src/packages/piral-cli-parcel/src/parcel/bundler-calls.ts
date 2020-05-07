import { resolve } from 'path';
import { fork } from 'child_process';
import { LogLevels, Bundler, BundleDetails, PiletSchemaVersion } from 'piral-cli';

function getPath(name: string) {
  return resolve(__dirname, '..', '..', 'lib', 'parcel', `run-${name}.js`);
}

function callDynamic(name: string, cwd: string, args: any) {
  return new Promise<Bundler>(resolve => {
    const ps = fork(getPath(name), [], { cwd });
    const listeners: Array<(args: any) => void> = [];
    const setPending = () => new Promise<void>(done => {
      const f = () => {
        done();
        listeners.splice(listeners.indexOf(f), 1);
      };
      listeners.push(f);
    });
    let promise = setPending();
    const bundle: BundleDetails = {
      dir: cwd,
      hash: '',
      name: '',
    };
    const bundler: Bundler = {
      bundle,
      start() {
        ps.send({
          type: 'bundle',
          ...args,
        });
      },
      on(cb) {
        listeners.push(cb);
      },
      off(cb) {
        listeners.splice(listeners.indexOf(cb), 1);
      },
      ready() {
        return promise;
      },
    };

    ps.on('message', (msg: any) => {
      switch (msg.type) {
        case 'pending':
          promise = setPending();
          break;
        case 'update':
          bundle.hash = msg.outHash;
          bundle.name = msg.outName;
          listeners.forEach(cb => cb(msg.args));
          break;
        case 'done':
          bundle.dir = msg.outDir;
          return resolve(bundler);
      }
    });

    ps.send({
      type: 'start',
      ...args,
    });
  });
}

function callStatic(name: string, cwd: string, args: any) {
  return new Promise<{ outFile: string; outDir: string }>(resolve => {
    const ps = fork(getPath(name), [], { cwd });
    ps.on('message', (msg: any) => {
      switch (msg.type) {
        case 'done':
          return resolve({
            outFile: msg.outFile,
            outDir: msg.outDir,
          });
      }
    });

    ps.send({
      type: 'start',
      ...args,
    });
  });
}

export function callDebugPiralFromMonoRepo(
  cwd: string,
  externals: Array<string>,
  piral: string,
  entryFiles: string,
  logLevel: LogLevels,
) {
  return callStatic('debug-mono-piral', cwd, {
    piral,
    externals,
    entryFiles,
    logLevel,
  });
}

export function callPiletDebug(
  cwd: string,
  piral: string,
  optimizeModules: boolean,
  hmr: boolean,
  scopeHoist: boolean,
  autoInstall: boolean,
  cacheDir: string,
  externals: Array<string>,
  targetDir: string,
  entryModule: string,
  logLevel: LogLevels,
  version: PiletSchemaVersion,
  ignored: Array<string>,
) {
  return callDynamic('debug-pilet', cwd, {
    piral,
    optimizeModules,
    hmr,
    scopeHoist,
    autoInstall,
    cacheDir,
    externals,
    targetDir,
    entryModule,
    logLevel,
    version,
    ignored,
  });
}

export function callPiralDebug(
  cwd: string,
  piral: string,
  optimizeModules: boolean,
  hmr: boolean,
  scopeHoist: boolean,
  autoInstall: boolean,
  cacheDir: string,
  externals: Array<string>,
  publicUrl: string,
  entryFiles: string,
  logLevel: LogLevels,
  ignored: Array<string>,
) {
  return callDynamic('debug-piral', cwd, {
    piral,
    optimizeModules,
    hmr,
    scopeHoist,
    autoInstall,
    cacheDir,
    externals,
    publicUrl,
    entryFiles,
    logLevel,
    ignored,
  });
}

export function callPiletBuild(
  cwd: string,
  piral: string,
  optimizeModules: boolean,
  scopeHoist: boolean,
  sourceMaps: boolean,
  contentHash: boolean,
  detailedReport: boolean,
  minify: boolean,
  cacheDir: string,
  externals: Array<string>,
  targetDir: string,
  outFile: string,
  outDir: string,
  entryModule: string,
  logLevel: LogLevels,
  version: PiletSchemaVersion,
  ignored: Array<string>,
) {
  return callStatic('build-pilet', cwd, {
    piral,
    optimizeModules,
    scopeHoist,
    sourceMaps,
    contentHash,
    detailedReport,
    minify,
    cacheDir,
    externals,
    targetDir,
    outFile,
    outDir,
    entryModule,
    logLevel,
    version,
    ignored,
  });
}

export function callPiralBuild(
  cwd: string,
  piral: string,
  develop: boolean,
  optimizeModules: boolean,
  scopeHoist: boolean,
  sourceMaps: boolean,
  contentHash: boolean,
  detailedReport: boolean,
  minify: boolean,
  cacheDir: string,
  externals: Array<string>,
  publicUrl: string,
  outFile: string,
  outDir: string,
  entryFiles: string,
  logLevel: LogLevels,
  ignored: Array<string>,
) {
  return callStatic('build-piral', cwd, {
    piral,
    optimizeModules,
    scopeHoist,
    develop,
    sourceMaps,
    contentHash,
    detailedReport,
    minify,
    cacheDir,
    externals,
    publicUrl,
    outFile,
    outDir,
    entryFiles,
    logLevel,
    ignored,
  });
}