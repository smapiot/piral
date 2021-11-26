const { exec } = require('child_process');

function run(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

function runWithJson(cmd) {
  return run(cmd).then((result) => JSON.parse(result));
}

function isInvalid(version) {
  // insert rules here
  if (version.startsWith('0.14.0') && (version.includes('-pre') || version.includes('-unstable'))) {
    return true;
  } else if (version.startsWith('1.0.0')) {
    return true;
  }

  return false;
}

runWithJson(`npx lerna ls --json --toposort`)
  .then(async (packages) => {
    const packageNames = packages.reverse().map((m) => m.name);

    for (const packageName of packageNames) {
      const versions = await runWithJson(`npm view ${packageName} versions --json`);

      for (const version of versions) {
        if (isInvalid(version)) {
          try {
            await run(`npm unpublish ${packageName}@${version}`);
            console.log(`Successfully unpublished ${packageName}@${version}.`);
          } catch (err) {
            console.error(`Could not unpublish ${packageName}@${version}: ${err}`);
          }
        }
      }
    }
  })
  .then(
    () => {
      console.log('Done!');
      process.exit(0);
    },
    () => {
      console.log('Check for errors ...');
      process.exit(1);
    },
  );
