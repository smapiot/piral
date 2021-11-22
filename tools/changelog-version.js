const { join } = require('path');
const { execSync } = require('child_process');
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
  const arg = process.argv.pop();
  const cwd = process.cwd();
  console.log(version);

  if (arg === '--update') {
    updateChangelogDate();
  } else if (arg === '--apply') {
    execSync(`lerna version ${version} --no-git-tag-version --yes`, {
      cwd,
      stdio: 'inherit',
      shell: true,
      env: {
        ...process.env,
        PATH: `${process.env.PATH}:${cwd}/node_modules/.bin`,
      },
    });
  }
} else {
  module.exports = {
    getChangelogVersion,
    updateChangelogDate,
  };
}
