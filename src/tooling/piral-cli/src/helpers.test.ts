import { keyOfForceOverwrite, keyOfPiletLanguage, valueOfForceOverwrite, valueOfPiletLanguage } from './helpers';
import { ForceOverwrite, SourceLanguage } from './common/enums';

describe('Piral CLI Command Helpers Module', () => {
  it('correct value of keyOfForceOverwrite results in same key', () => {
    const result = keyOfForceOverwrite(ForceOverwrite.yes);
    expect(result).toBe('yes');
  });

  it('incorrect value of keyOfForceOverwrite results in first key', () => {
    const result = keyOfForceOverwrite(5);
    expect(result).toBe('no');
  });

  it('correct value of keyOfPiletLanguage results in same key', () => {
    const result = keyOfPiletLanguage(SourceLanguage.ts);
    expect(result).toBe('ts');
  });

  it('incorrect value of keyOfPiletLanguage results in key for TS', () => {
    const result = keyOfPiletLanguage(5);
    expect(result).toBe('ts');
  });

  it('correct key of valueOfForceOverwrite results in same value', () => {
    const result = valueOfForceOverwrite('prompt');
    expect(result).toBe(ForceOverwrite.prompt);
  });

  it('incorrect key of valueOfForceOverwrite results in first value', () => {
    const result = valueOfForceOverwrite('foo');
    expect(result).toBe(ForceOverwrite.no);
  });

  it('correct key of valueOfPiletLanguage results in same value', () => {
    const result = valueOfPiletLanguage('ts');
    expect(result).toBe(SourceLanguage.ts);
  });

  it('incorrect key of valueOfPiletLanguage results in value for TS', () => {
    const result = valueOfPiletLanguage('foo');
    expect(result).toBe(SourceLanguage.ts);
  });
});
