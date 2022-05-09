import { callDynamic, callStatic } from './build/bundler-calls';
import { availableBundlers } from './helpers';
import {
  installNpmPackage,
  cliVersion,
  fail,
  progress,
  log,
  determineNpmClient,
  patchModules,
  logReset,
  config,
} from './common';
import {
  Bundler,
  BundleDetails,
  DebugPiralParameters,
  BuildPiletParameters,
  BuildPiralParameters,
  WatchPiralParameters,
  DebugPiletParameters,
  BundlerDefinition,
  BaseBundleParameters,
  BaseBundlerDefinition,
} from './types';

export interface QualifiedBundler {
  name: string;
  actions: BundlerDefinition;
}

const bundlers: Array<QualifiedBundler> = [];

async function installDefaultBundler(root: string) {
  const selectedBundler = config.bundler || 'webpack';
  log('generalDebug_0003', `Installation of default bundler for "${selectedBundler}".`);
  const selectedPackage = `piral-cli-${selectedBundler}`;
  log('generalDebug_0003', `Determining npm client at "${root}" ...`);
  const client = await determineNpmClient(root);
  log('generalDebug_0003', `Prepare to install ${selectedPackage}@${cliVersion} using "${client}" into "${root}".`);
  progress(`Installing ${selectedPackage} ...`);
  await installNpmPackage(client, `${selectedPackage}@${cliVersion}`, root, '--save-dev', '--save-exact');
  log('generalDebug_0003', `Installed bundler from "${selectedPackage}".`);

  require('./inject').inject(selectedPackage);
}

function checkDefaultBundler(bundler: QualifiedBundler) {
  if (!bundler?.actions) {
    fail('defaultBundlerMissing_0173');
  }

  return bundler;
}

function checkCustomBundler(bundler: QualifiedBundler, bundlerName: string) {
  if (!bundler?.actions) {
    fail('bundlerMissing_0172', bundlerName, availableBundlers);
  }

  return bundler;
}

async function findBundler(root: string, bundlerName?: string) {
  const [defaultBundler] = bundlers;

  if (bundlerName) {
    const [bundler] = bundlers.filter((m) => m.name === bundlerName);
    return checkCustomBundler(bundler, bundlerName);
  } else if (!defaultBundler) {
    await installDefaultBundler(root);
    const [bundler] = bundlers;
    return checkDefaultBundler(bundler);
  } else if (bundlers.length > 1) {
    log('bundlerUnspecified_0175', availableBundlers);
  }

  return defaultBundler;
}

async function prepareArgs<T extends BaseBundleParameters>(bundler: BaseBundlerDefinition<T>, args: T): Promise<T> {
  if (args.optimizeModules) {
    progress('Preparing modules ...');
    await patchModules(args.root, args.ignored);
    logReset();
  }

  if (bundler.prepare) {
    return await bundler.prepare(args);
  }

  return args;
}

export function setBundler(bundler: QualifiedBundler) {
  bundlers.push(bundler);

  if (!availableBundlers.includes(bundler.name)) {
    availableBundlers.push(bundler.name);
  }
}

export async function callPiralDebug(args: DebugPiralParameters, bundlerName?: string): Promise<Bundler> {
  const bundler = await findBundler(args.root, bundlerName);

  try {
    const action = bundler.actions.debugPiral;
    const params = await prepareArgs(action, args);
    return await callDynamic('debug-piral', action.path, params);
  } catch (err) {
    fail('bundlingFailed_0174', err);
  }
}

export async function callPiletDebug(args: DebugPiletParameters, bundlerName?: string): Promise<Bundler> {
  const bundler = await findBundler(args.root, bundlerName);

  try {
    const action = bundler.actions.debugPilet;
    const params = await prepareArgs(action, args);
    return await callDynamic('debug-pilet', action.path, params);
  } catch (err) {
    fail('bundlingFailed_0174', err);
  }
}

export async function callPiralBuild(args: BuildPiralParameters, bundlerName?: string): Promise<BundleDetails> {
  const bundler = await findBundler(args.root, bundlerName);

  try {
    const action = bundler.actions.buildPiral;
    const params = await prepareArgs(action, args);
    const instance = await callStatic('build-piral', action.path, params);
    return instance.bundle;
  } catch (err) {
    fail('bundlingFailed_0174', err);
  }
}

export async function callPiletBuild(args: BuildPiletParameters, bundlerName?: string): Promise<BundleDetails> {
  const bundler = await findBundler(args.root, bundlerName);

  try {
    const action = bundler.actions.buildPilet;
    const params = await prepareArgs(action, args);
    const instance = await callStatic('build-pilet', action.path, params);
    return instance.bundle;
  } catch (err) {
    fail('bundlingFailed_0174', err);
  }
}

export async function callDebugPiralFromMonoRepo(
  args: WatchPiralParameters,
  bundlerName?: string,
): Promise<BundleDetails> {
  const bundler = await findBundler(args.root, bundlerName);

  try {
    const action = bundler.actions.watchPiral;
    const params = await prepareArgs(action, args);
    const instance = await callStatic('debug-mono-piral', action.path, params);
    return instance.bundle;
  } catch (err) {
    fail('bundlingFailed_0174', err);
  }
}
