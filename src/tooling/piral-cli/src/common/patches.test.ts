import { describe, it, expect } from 'vitest';
import { getPatch, installPatch } from './patches';

const patchName = 'foo';
const patch = (rootDir) => {
  return Promise.resolve();
};

describe('Patch Module', () => {
  it('installs and gets a patch', async () => {
    installPatch(patchName, patch);
    let result = getPatch(patchName);
    expect(result).toBe(patch);
    result = getPatch('wrongPatch');
    expect(result).toBeUndefined();
    installPatch(patchName, patch);
  });
});
