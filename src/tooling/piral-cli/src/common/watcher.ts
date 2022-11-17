export interface WatcherContext {
  onClean(dispose: () => void): void;
  watch(file: string): void;
}

export function watcherTask(cb: (watcherContext: WatcherContext) => Promise<void>) {
  return new Promise<void>((resolve, reject) => {
    const disposers: Array<() => void> = [];
    const context: WatcherContext = {
      onClean(dispose) {
        disposers.push(dispose);
      },
      watch(file) {},
    };
    cb(context).then(
      () => {
        resolve();
      },
      (err) => {
        reject(err);
      },
    );
  });
}
