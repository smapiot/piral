const { join } = require('path');
const { execSync } = require('child_process');
const { readFileSync, writeFileSync } = require('fs');

const defaultPath = join(__dirname, '..', 'CHANGELOG.md');

function getChangelogVersion(changelogPath = defaultPath) {
  const CHANGELOG = readFileSync(changelogPath, 'utf8');
  const matches = /^\#\# (\d+\.\d+\.\d+) .*/gm.exec(CHANGELOG);

  if (!matches) {
    throw new Error(
      'Invalid CHANGELOG format found. Need to fine line starting with "## x.y.z" to get the latest version.',
    );
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

function getVersion(full, flags) {
  const id = process.env.BUILD_BUILDID || '0';

  if (flags.includes('--beta')) {
    return `${full}-beta.${id}`;
  } else if (flags.includes('--alpha')) {
    return `${full}-alpha.${id}`;
  }

  return full;
}

if (require.main === module) {
  const args = process.argv;
  const changelogVersion = getChangelogVersion();
  const version = getVersion(changelogVersion, args);
  const cwd = process.cwd();
  console.log(version);

  if (args.includes('--update')) {
    updateChangelogDate();
  } else if (args.includes('--apply')) {
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
