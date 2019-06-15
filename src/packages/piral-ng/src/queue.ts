let queue = Promise.resolve();

export function enqueue(callback: () => void) {
  queue = queue.then(callback);
}
