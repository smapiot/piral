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
    console.error = jest.fn();
    await upgradePilet(dir);
    expect(console.error).toHaveBeenCalled();
  });
});
