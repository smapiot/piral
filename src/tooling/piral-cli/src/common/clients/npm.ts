import { resolve } from 'path';
import { log } from '../log';
import { findFile } from '../io';
import { runCommand } from '../scripts';
import { MemoryStream } from '../MemoryStream';

// Helpers:

function runNpmProcess(args: Array<string>, target: string, output?: NodeJS.WritableStream) {
  log('generalDebug_0003', 'Starting the npm process ...');
  const cwd = resolve(process.cwd(), target);
  return runCommand('npm', args, cwd, output);
}

// Client interface functions:

export async function installDependencies(target = '.', ...flags: Array<string>) {
  const ms = new MemoryStream();
  await runNpmProcess(['install', '--legacy-peer-deps', ...flags], target, ms);
  log('generalDebug_0003', `npm install dependencies result: ${ms.value}`);
  return ms.value;
}

export async function installPackage(packageRef: string, target = '.', ...flags: Array<string>) {
  const ms = new MemoryStream();
  await runNpmProcess(['install', packageRef, '--legacy-peer-deps', ...flags], target, ms);
  log('generalDebug_0003', `npm install package result: ${ms.value}`);
  return ms.value;
}

export async function detectClient(root: string) {
  return !!(await findFile(root, 'package-lock.json'));
}

export async function isProject(root: string, packageRef: string) {
  const details = await listPackage(packageRef, root);
  const packageDetails =  details?.dependencies?.[packageRef];

  if (packageDetails && typeof packageDetails.resolved === 'string') {
    return packageDetails.resolved.startsWith('file:');
  }

  return false;
}

export async function initProject(projectName: string, target: string) {}

// Functions to exclusively use from npm client:

export async function unpackPackage(packageRef: string, target = '.', ...flags: Array<string>) {
  const ms = new MemoryStream();
  await runNpmProcess(['pack', packageRef, ...flags], target, ms);
  log('generalDebug_0003', `npm (un)pack result: ${ms.value}`);
  return ms.value;
}

export async function createPackage(target = '.', ...flags: Array<string>) {
  const ms = new MemoryStream();
  await runNpmProcess(['pack', ...flags], target, ms);
  log('generalDebug_0003', `npm pack result: ${ms.value}`);
  return ms.value;
}

export async function publishPackage(target = '.', file = '*.tgz', ...flags: Array<string>) {
  const ms = new MemoryStream();
  await runNpmProcess(['publish', file, ...flags], target, ms);
  log('generalDebug_0003', `npm publish result: ${ms.value}`);
  return ms.value;
}

export async function findSpecificVersion(packageName: string, version: string) {
  const ms = new MemoryStream();
  await runNpmProcess(['show', packageName, 'version', '--tag', version], '.', ms);
  log('generalDebug_0003', `npm show result: ${ms.value}`);
  return ms.value;
}

export async function findTarball(packageRef: string, target = '.', ...flags: Array<string>) {
  const ms = new MemoryStream();
  await runNpmProcess(['view', packageRef, 'dist.tarball', ...flags], target, ms);
  log('generalDebug_0003', `npm view packageRef result: ${ms.value}`);
  return ms.value;
}

export async function listPackage(packageRef: string, target = '.', ...flags: Array<string>) {
  const ms = new MemoryStream();

  try {
    await runNpmProcess(['ls', packageRef, '--json', '--depth', '0', ...flags], target, ms);
  } catch (e) {
    log('generalDebug_0003', `npm ls packageRef error: ${e}`);
    return {};
  }

  log('generalDebug_0003', `npm ls packageRef result: ${ms.value}`);
  return JSON.parse(ms.value);
}
