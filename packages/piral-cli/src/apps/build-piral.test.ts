import { mkdtempSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { buildPiral } from './build-piral';

function createTempDir() {
  return mkdtempSync(join(tmpdir(), 'piral-tests-build-piral-'));
}

describe('Build Piral Command', () => {
  it('missing source should result in an error', async () => {
    const dir = createTempDir();
    console.error = jest.fn();
    await buildPiral(dir);
    expect(console.error).toHaveBeenCalled();
  });
});
