import { watch, existsSync } from 'fs';

export interface WatcherRef<T> {
  end: Promise<void>;
  data: T;
  on(cb: () => void): void;
  off(cb: () => void): void;
}

export interface WatcherContext {
  onClean(dispose: () => void | Promise<void>): void;
  watch(file: string): void;
  dependOn<T>(ref: WatcherRef<T>): void;
  close(): void;
  status: 'initial' | 'reoccuring';
}

export function watcherTask<T = void>(cb: (watcherContext: WatcherContext) => Promise<T>) {
  let running = Promise.resolve();
  let pending = false;
  let notify = () => {};

  const disposers: Array<() => void | Promise<void>> = [];
  const triggers: Array<() => void> = [];
  const end = new Promise<void>((resolve) => {
    notify = resolve;
  });
  const ref: WatcherRef<T> = {
    data: undefined,
    on(cb) {
      triggers.push(cb);
    },
    off(cb) {
      const idx = triggers.indexOf(cb);
      idx >= 0 && triggers.splice(idx, 1);
    },
    end,
  };

  const reRun = async () => {
    if (!pending) {
      pending = true;
      await running;
      await Promise.all(disposers.splice(0, disposers.length).map((dispose) => dispose()));

      pending = false;
      context.status = 'reoccuring';
      await run();

      triggers.splice(0, triggers.length).forEach((trigger) => trigger());
    }
  };

  const context: WatcherContext = {
    onClean(dispose) {
      disposers.push(dispose);
    },
    watch(file) {
      if (existsSync(file)) {
        const watcher = watch(
          file,
          {
            persistent: false,
          },
          reRun,
        );
        disposers.push(() => watcher.close());
      }
    },
    dependOn(anotherRef) {
      anotherRef.on(reRun);
    },
    close() {
      cb = () => Promise.resolve(undefined);
      reRun().then(notify);
    },
    status: 'initial',
  };

  const run = async () => {
    running = cb(context).then((data) => {
      ref.data = data;
    });
    await running;
    return ref;
  };

  return new Promise<WatcherRef<T>>((resolve, reject) => {
    run().then(resolve, reject);
  });
}
