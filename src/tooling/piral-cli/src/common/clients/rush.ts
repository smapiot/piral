import { dirname, relative, resolve } from 'path';
import { log } from '../log';
import { findFile, readText, writeText } from '../io';
import { jju } from '../../external';
import { runCommand } from '../scripts';
import { MemoryStream } from '../MemoryStream';

// Helpers:
const rushJson = 'rush.json';

function runRushProcess(args: Array<string>, target: string, output?: NodeJS.WritableStream) {
  log('generalDebug_0003', 'Starting the Rush process ...');
  const cwd = resolve(process.cwd(), target);
  return runCommand('rush', args, cwd, output);
}

function convert(flags: Array<string>) {
  return flags.map((flag) => {
    switch (flag) {
      case '--save-exact':
        // discard as this may lead to problems
        return '';
      case '--save-dev':
        return '--dev';
      case '--no-save':
        // unfortunately no
        return '';
      default:
        return flag;
    }
  });
}

// Client interface functions:

export async function installDependencies(target = '.', ...flags: Array<string>) {
  const ms = new MemoryStream();
  await runRushProcess(['update', ...convert(flags)], target, ms);
  log('generalDebug_0003', `Rush install dependencies result: ${ms.value}`);
  return ms.value;
}

export async function installPackage(packageRef: string, target = '.', ...flags: Array<string>) {
  const ms = new MemoryStream();
  await runRushProcess(['add', '--package', packageRef, ...convert(flags)], target, ms);
  log('generalDebug_0003', `Rush install package result: ${ms.value}`);
  return ms.value;
}

export async function detectClient(root: string) {
  return !!(await findFile(root, rushJson));
}

export async function initProject(packageName: string, target: string) {
  const rushPath = await findFile(target, rushJson);

  if (!rushPath) {
    throw new Error(
      `Could not find the "${rushJson}" from "${target}". Sure you want to create the project in the right directory?`,
    );
  }

  const rushDir = dirname(rushPath);
  const rushContent = await readText(rushDir, rushJson);
  const rushData = jju.parse(rushContent);
  const projectFolder = relative(rushDir, target);

  if (!Array.isArray(rushData.projects)) {
    rushData.projects = [];
  }

  rushData.projects.push({
    packageName,
    projectFolder,
  });

  await writeText(
    rushDir,
    rushJson,
    jju.update(rushContent, rushData, {
      mode: 'cjson',
      indent: 2,
    }),
  );
}

export async function isProject(root: string, packageRef: string) {
  const details = await listProjects(root);

  if (typeof details === 'object' && Array.isArray(details?.projects)) {
    return details?.projects?.some((p) => p.name === packageRef) ?? false;
  }

  return false;
}

// Functions to exclusively use from rush client:

export async function listProjects(target: string) {
  const ms = new MemoryStream();

  try {
    await runRushProcess(['list', '--json'], target, ms);
  } catch (e) {
    log('generalDebug_0003', `rush list error: ${e}`);
    return {};
  }

  log('generalDebug_0003', `rush list project result: ${ms.value}`);
  return JSON.parse(ms.value);
}
