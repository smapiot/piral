const { join } = require('path');
const { readFileSync, writeFileSync } = require('fs');

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

function updateChangelogDate(changelogPath = defaultPath) {
  const CHANGELOG = readFileSync(changelogPath, 'utf8');
  const matches = /^\#\# (\d+\.\d+\.\d+) .*/gm.exec(CHANGELOG);
  const date = new Date().toLocaleDateString('en-us', {
    month: 'long',
    year: 'numeric',
    day: 'numeric',
  });
  const newContent = CHANGELOG.replace(matches[0], `## ${matches[1]} (${date})`);
  writeFileSync(changelogPath, newContent, 'utf8');
}

if (require.main === module) {
  const version = getChangelogVersion();
  console.log(version);

  if (process.argv.pop() === '--update') {
    updateChangelogDate();
  }
} else {
  module.exports = {
    getChangelogVersion,
    updateChangelogDate,
  };
}
