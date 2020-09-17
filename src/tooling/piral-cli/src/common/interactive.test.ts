import { promptConfirm, promptSelect } from './interactive';

const answer = 'Yes, really';

jest.mock('../external', () => ({
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
