let queue = Promise.resolve();

export function enqueue<T>(callback: () => T | Promise<T>) {
  const next = queue.then(callback);
  queue = next.then(() => {});
  return next;
}
