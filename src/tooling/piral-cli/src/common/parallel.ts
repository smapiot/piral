export async function concurrentWorkers<T, R>(
  items: Array<T>,
  concurrency: number,
  worker: (item: T) => Promise<R>,
): Promise<Array<R>> {
  const maxItems = items.length;
  const results: Array<R> = new Array(maxItems);
  let offset = 0;

  await Promise.all(
    items.slice(0, concurrency).map(async () => {
      while (offset < maxItems) {
        const i = offset++;
        const item = items[i];
        results[i] = await worker(item);
      }
    }),
  );

  return results;
}
