const { exec } = require('child_process');

const npmRegistry = 'https://registry.npmjs.org/';

function run(cmd, options = {}) {
  const { ignoreError = false } = options;

  return new Promise((resolve, reject) => {
    exec(
      cmd,
      {
        env: {
          ...process.env,
          npm_config_registry: npmRegistry,
          NPM_CONFIG_REGISTRY: npmRegistry,
        },
      },
      (err, stdout, stderr) => {
      if (err) {
        if (ignoreError) {
          resolve({ ok: false, stdout: stdout || '', stderr: stderr || '' });
        } else {
          reject(err);
        }
      } else {
        resolve({ ok: true, stdout: stdout || '', stderr: stderr || '' });
      }
      },
    );
  });
}

function runWithJson(cmd) {
  return run(cmd).then((result) => JSON.parse(result.stdout));
}

function getArg(name) {
  const i = process.argv.indexOf(name);

  if (i >= 0 && process.argv[i + 1]) {
    return process.argv[i + 1];
  }

  return undefined;
}

function isFlagSet(name) {
  return process.argv.includes(name);
}

async function isVersionPublished(packageName, version) {
  const result = await run(
    `npm view ${packageName}@${version} version --json --registry ${npmRegistry}`,
    {
      ignoreError: true,
    },
  );

  if (!result.ok) {
    return false;
  }

  try {
    const data = JSON.parse(result.stdout);

    if (Array.isArray(data)) {
      return data.includes(version);
    }

    return data === version;
  } catch {
    return result.stdout.trim() === version;
  }
}

async function publishMissingPackages() {
  const packages = await runWithJson(`npx lerna ls --json --toposort`);
  const distTag = getArg('--tag') || 'latest';
  const provenance = isFlagSet('--provenance');
  const provenanceArg = provenance ? ' --provenance' : '';

  for (const pkg of packages) {
    const isPublished = await isVersionPublished(pkg.name, pkg.version);

    if (isPublished) {
      console.log(`Skipping package: ${pkg.name}@${pkg.version} (already published)`);
      continue;
    }

    console.log(`Publishing package: ${pkg.name}@${pkg.version} (tag: ${distTag})`);

    await run(
      `npm publish ${pkg.location} --tag ${distTag}${provenanceArg} --registry ${npmRegistry}`,
    );

    console.log(`Published package: ${pkg.name}@${pkg.version}`);
  }
}

publishMissingPackages().then(
  () => {
    console.log('Done!');
    process.exit(0);
  },
  (err) => {
    console.error(err);
    process.exit(1);
  },
);
