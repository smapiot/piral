import { concurrentWorkers } from './parallel';

describe('Concurrent Workers', () => {
  it('Can run against no entries', async () => {
    const result = await concurrentWorkers([], 10, () => Promise.resolve('foo'));
    expect(result).toEqual([]);
  });

  it('Can run against single entry', async () => {
    const result = await concurrentWorkers(['bar'], 10, (item) => Promise.resolve('foo' + item));
    expect(result).toEqual(['foobar']);
  });

  it('Can run against less entries than concurrency', async () => {
    const result = await concurrentWorkers(['bar', 'rba', 'abr', 'rab', 'arb', 'bra'], 10, (item) => Promise.resolve('foo' + item));
    expect(result).toEqual(['foobar', 'foorba', 'fooabr', 'foorab', 'fooarb', 'foobra']);
  });

  it('Can run against more entries than concurrency', async () => {
    const result = await concurrentWorkers(['bar', 'rba', 'abr', 'rab', 'arb', 'bra'], 2, (item) => Promise.resolve('foo' + item));
    expect(result).toEqual(['foobar', 'foorba', 'fooabr', 'foorab', 'fooarb', 'foobra']);
  });

  it('Can run against equal entries than concurrency', async () => {
    const result = await concurrentWorkers(['bar', 'rba', 'abr', 'rab', 'arb', 'bra'], 6, (item) => Promise.resolve('foo' + item));
    expect(result).toEqual(['foobar', 'foorba', 'fooabr', 'foorab', 'fooarb', 'foobra']);
  });
});
