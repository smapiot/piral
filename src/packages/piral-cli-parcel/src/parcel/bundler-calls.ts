import { resolve } from 'path';
import { fork, ChildProcess } from 'child_process';
import { Bundler, BundleDetails } from 'piral-cli';

function getPath(name: string) {
  return resolve(__dirname, '..', '..', 'lib', 'parcel', `run-${name}.js`);
}

function createBundler(cwd: string, ps: ChildProcess, args: any) {
  const listeners: Array<(args: any) => void> = [];
  const bundle: BundleDetails = {
    dir: cwd,
    hash: '',
    name: '',
  };
  const setPending = () =>
    new Promise<void>(done => {
      const f = () => {
        done();
        bundler.off(f);
      };
      bundler.on(f);
    });
  const bundler = {
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
    emit(msg) {
      listeners.forEach(cb => cb(msg));
    },
    ready() {
      return promise;
    },
    setPending,
  };
  let promise = setPending();
  return bundler;
}

export function callDynamic(name: string, cwd: string, args: any) {
  return new Promise<Bundler>(resolve => {
    const ps = fork(getPath(name), [], { cwd });
    const bundler = createBundler(cwd, ps, args);

    ps.on('message', (msg: any) => {
      switch (msg.type) {
        case 'pending':
          bundler.setPending();
          break;
        case 'update':
          bundler.bundle.hash = msg.outHash;
          bundler.bundle.name = msg.outName;
          bundler.emit(msg.args);
          break;
        case 'done':
          bundler.bundle.dir = msg.outDir;
          return resolve(bundler);
      }
    });

    ps.send({
      type: 'start',
      ...args,
    });
  });
}

export function callStatic(name: string, cwd: string, args: any) {
  return new Promise<Bundler>(resolve => {
    const ps = fork(getPath(name), [], { cwd });
    const bundler = createBundler(cwd, ps, args);

    ps.on('message', (msg: any) => {
      switch (msg.type) {
        case 'done':
          bundler.bundle.dir = msg.outDir;
          bundler.bundle.name = msg.outFile;
          return resolve(bundler);
      }
    });

    ps.send({
      type: 'start',
      ...args,
    });
  });
}
