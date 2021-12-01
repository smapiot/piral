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

runWithJson(`npx lerna ls --json --toposort`).then(async (packages) => {
  for (const package of packages) {
    const result = await run(`npm show ${package.name} version`);
    const version = result.trim();

    if (version !== package.version) {
      console.log('Publishing package:', package.name, package.version, version);

      await run(`npx lerna exec "npm publish" --scope ${package.name}`);

      console.log('Published package!');
    } else {
      console.log('Skipping package:', package.name);
    }
  }
});
