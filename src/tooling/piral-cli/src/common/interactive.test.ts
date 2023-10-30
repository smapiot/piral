import { describe, it, expect, vitest } from 'vitest';
import { promptConfirm, promptSelect } from './interactive';

const answer = 'Yes, really';

vitest.mock('../external', () => ({
  rc(_, cfg) {
    return cfg;
  },
  ora() {
    return {};
  },
  inquirer: {
    prompt: (...any) => {
      return Promise.resolve({ q: answer });
    },
  } as any,
}));

describe('Interactive Module', () => {
  it('prompts for a selection', async () => {
    await promptSelect('Really?', [answer, 'No, not really'], answer).then((result) => expect(result).toEqual(answer));
  });

  it('prompts for a confirmation', async () => {
    await promptConfirm('Really?', true).then((result) => expect(result).toBeTruthy());
  });
});
