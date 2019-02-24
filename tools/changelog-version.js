const { join } = require('path');
const { readFileSync } = require('fs');

const defaultPath = join(__dirname, '..', 'CHANGELOG.md');

function getChangelogVersion(changelogPath = defaultPath) {
  const CHANGELOG = readFileSync(changelogPath, 'utf8');
  const matches = /^\#\# (\d+\.\d+\.\d+) .*/gm.exec(CHANGELOG);

  if (!matches) {
    throw new Error('Invalid CHANGELOG format found. Need to fine line starting with "## x.y.z" to get the latest version.');
  }

  const version = matches[1];
  return version;
}

if (require.main === module) {
  const version = getChangelogVersion();
  console.log(version);
} else {
  module.exports = getChangelogVersion;
}
