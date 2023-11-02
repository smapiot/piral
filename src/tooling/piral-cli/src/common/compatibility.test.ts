import { describe, it, expect } from 'vitest';
import { checkAppShellCompatibility } from './compatibility';
import { cliVersion } from './info';

describe('Compatibility Module', () => {
  it('works with the current version', () => {
    const isCompatible = checkAppShellCompatibility(cliVersion);
    expect(isCompatible).toBe(true);
  });

  it('does not work with the first version', () => {
    const isCompatible = checkAppShellCompatibility('0.1.0');
    expect(isCompatible).toBe(false);
  });

  it('works with some minor version', () => {
    const [major, minor] = cliVersion.split('.');
    const isCompatible = checkAppShellCompatibility(`${major}.${minor}.7`);
    expect(isCompatible).toBe(true);
  });

  it('does not work with the next major version', () => {
    const [major, minor, patch] = cliVersion.split('.');
    const isCompatible = checkAppShellCompatibility(`${major + 1}.${minor}.${patch}`);
    expect(isCompatible).toBe(false);
  });

  it('does not work with the previous major version', () => {
    const [major, minor, patch] = cliVersion.split('.');
    const isCompatible = checkAppShellCompatibility(`${major - 1}.${minor}.${patch}`);
    expect(isCompatible).toBe(false);
  });
});
