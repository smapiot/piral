import { resolve } from 'path';
import { fork, ChildProcess } from 'child_process';
import type { Bundler, BundleDetails, BaseBundleParameters } from '../types';

function getPath(name: string) {
  return resolve(__dirname, '..', '..', 'lib', 'build', `run-${name}.js`);
}

type BundleListener = (args: any) => void;

function createBundler(cwd: string, ps: ChildProcess, args: any) {
  let promise = Promise.resolve();
  let started = false;
  const listeners: Array<BundleListener> = [];
  const bundle: BundleDetails = {
    dir: cwd,
    hash: '',
    name: '',
  };
  const setPending = () => {
    promise = new Promise((done) => {
      const f = () => {
        done();
        bundler.off(f);
      };
      bundler.on(f);
    });
  };
  const bundler = {
    bundle,
    start() {
      if (!started) {
        started = true;
        ps.send({
          type: 'bundle',
          ...args,
        });
      }
    },
    stop() {
      return new Promise<void>((resolve) => {
        ps.on('exit', resolve);
        ps.kill();
      });
    },
    on(cb: BundleListener) {
      listeners.push(cb);
    },
    off(cb: BundleListener) {
      listeners.splice(listeners.indexOf(cb), 1);
    },
    emit(args: any) {
      [...listeners].forEach((cb) => cb(args));
    },
    ready() {
      return promise;
    },
    setPending,
  };
  setPending();
  return bundler;
}

export function callDynamic<T extends BaseBundleParameters>(name: string, path: string, args: T, exec?: string) {
  const cwd = args.root;
  return new Promise<Bundler>((resolve, reject) => {
    const ps = fork(getPath(name), [], { cwd, stdio: 'pipe', env: process.env, execPath: exec });
    const bundler = createBundler(cwd, ps, args);
    const setup = {
      type: 'init',
      path,
    };
    const start = () => {
      ps.send({
        type: 'start',
        ...args,
      });
    };

    ps.stderr && process.stderr && ps.stderr.pipe(process.stderr, { end: false });
    ps.stdout && process.stdout && ps.stdout.pipe(process.stdout, { end: false });
    ps.stdin && process.stdin && ps.stdin.pipe(process.stdin, { end: false });

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
        case 'fail':
          return reject(msg.error);
      }
    });

    ps.send(setup, start);
  });
}

export function callStatic<T extends BaseBundleParameters>(name: string, path: string, args: T, exec?: string) {
  const cwd = args.root;
  return new Promise<Bundler>((resolve, reject) => {
    const ps = fork(getPath(name), [], { cwd, stdio: 'pipe', env: process.env, execPath: exec });
    const bundler = createBundler(cwd, ps, args);
    const setup = {
      type: 'init',
      path,
    };
    const start = () => {
      ps.send({
        type: 'start',
        ...args,
      });
    };

    ps.stderr && process.stderr && ps.stderr.pipe(process.stderr, { end: false });
    ps.stdout && process.stdout && ps.stdout.pipe(process.stdout, { end: false });
    ps.stdin && process.stdin && ps.stdin.pipe(process.stdin, { end: false });

    ps.on('message', (msg: any) => {
      switch (msg.type) {
        case 'done':
          bundler.bundle.dir = msg.outDir;
          bundler.bundle.name = msg.outFile;
          return resolve(bundler);
        case 'fail':
          return reject(msg.error);
      }
    });

    ps.send(setup, start);
  });
}
