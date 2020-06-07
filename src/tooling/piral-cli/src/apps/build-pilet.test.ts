import { mkdtempSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { buildPilet } from './build-pilet';

function createTempDir() {
  return mkdtempSync(join(tmpdir(), 'piral-tests-build-pilet-'));
}

describe('Build Pilet Command', () => {
  it('missing package.json should result in an error', async () => {
    const dir = createTempDir();
    let failed = false;

    try {
      await buildPilet(dir);
    } catch {
      failed = true;
    }

    expect(failed).toBeTruthy();
  });
});
