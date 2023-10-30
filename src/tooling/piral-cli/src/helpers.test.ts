import { describe, it, expect } from 'vitest';
import { keyOfForceOverwrite, valueOfForceOverwrite } from './helpers';
import { ForceOverwrite } from './common/enums';

describe('Piral CLI Command Helpers Module', () => {
  it('correct value of keyOfForceOverwrite results in same key', () => {
    const result = keyOfForceOverwrite(ForceOverwrite.yes);
    expect(result).toBe('yes');
  });

  it('incorrect value of keyOfForceOverwrite results in first key', () => {
    const result = keyOfForceOverwrite(5);
    expect(result).toBe('no');
  });

  it('correct key of valueOfForceOverwrite results in same value', () => {
    const result = valueOfForceOverwrite('prompt');
    expect(result).toBe(ForceOverwrite.prompt);
  });

  it('incorrect key of valueOfForceOverwrite results in first value', () => {
    const result = valueOfForceOverwrite('foo');
    expect(result).toBe(ForceOverwrite.no);
  });
});
