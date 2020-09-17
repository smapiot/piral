import { ruleSummary, runRules } from './rules';

const rule = {
  run: jest.fn(),
  name: 'test',
};

describe('Rules Module', () => {
  it('ruleSummary with/without errors and warnings', () => {
    const runException = () => {
      ruleSummary(['Error!'], []);
    };
    expect(runException).toThrow(Error('[0080] Validation failed. Found 1 error(s).'));

    let consoleSpy = jest.spyOn(console, 'log');
    ruleSummary([], []);
    expect(consoleSpy).toHaveBeenCalledWith('[0082] Validation successfully.');

    jest.clearAllMocks();
    ruleSummary([], ['Warning!']);
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('runRules with/without rules', async () => {
    await runRules([], {} as any, {}).then((result) => expect(result).toBeUndefined());
    await runRules([rule], {} as any, { test: {} }).then((result) => expect(result).toBeUndefined());
  });
});
