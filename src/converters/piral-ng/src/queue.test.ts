import { enqueue } from './queue';

describe('queue', () => {
  it('queueing works', async () => {
    const elements = [];
    await new Promise((resolve) => {
      enqueue(() => elements.push('ho'));
      enqueue(() => elements.push('hop'));
      enqueue(resolve);
    });
    expect(elements).toEqual(['ho', 'hop']);
  });
});
