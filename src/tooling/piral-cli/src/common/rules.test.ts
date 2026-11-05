import { describe, it, expect, vitest } from 'vitest';
import { ruleSummary, runRules } from './rules';
import { chalk } from '../external';

const rule = {
  run: vitest.fn(),
  name: 'test',
};

describe('Rules Module', () => {
  it('ruleSummary with/without errors and warnings', () => {
    const runException = () => {
      ruleSummary(['Error!'], []);
    };
    expect(runException).toThrow('[0080] Validation failed. Found 1 error(s).');

    let consoleSpy = vitest.spyOn(process.stderr, 'write');
    ruleSummary([], []);
    expect(consoleSpy).toHaveBeenLastCalledWith(`${chalk.green('✔')} Validation successful. No errors or warnings.\n`);

    vitest.clearAllMocks();
    ruleSummary([], ['Warning!']);
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('runRules with/without rules', async () => {
    await runRules([], {} as any, {}).then((result) => expect(result).toBeUndefined());
    await runRules([rule], {} as any, { test: {} }).then((result) => expect(result).toBeUndefined());
  });

  it('warns about missing configured rules by default', async () => {
    const warning = vitest.fn();
    const error = vitest.fn();

    await runRules([], { warning, error } as any, { missing: {} });

    expect(warning).toHaveBeenCalledWith('Configured validator(s) could not be loaded: missing');
    expect(error).not.toHaveBeenCalled();
  });

  it('errors about missing configured rules in strict mode', async () => {
    const warning = vitest.fn();
    const error = vitest.fn();

    await runRules([], { warning, error } as any, { missing: {} }, true);

    expect(error).toHaveBeenCalledWith('Configured validator(s) could not be loaded: missing');
    expect(warning).not.toHaveBeenCalled();
  });
});
