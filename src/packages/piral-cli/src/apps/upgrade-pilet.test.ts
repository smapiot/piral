import { mkdtempSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { upgradePilet } from './upgrade-pilet';

function createTempDir() {
  return mkdtempSync(join(tmpdir(), 'piral-test-upgrade-pilet-'));
}

describe('Upgrade Pilet Command', () => {
  it('cannot upgrade in a directory without a package.json', async () => {
    const dir = createTempDir();
    let failed = false;

    try {
      await upgradePilet(dir, {
        install: false,
      });
    } catch {
      failed = true;
    }

    expect(failed).toBeTruthy();
  });
});
