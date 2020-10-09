import { availableBundlers } from './helpers';
import {
  installPackage,
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
  log('generalDebug_0003', `Determining NPM client at "${root}" ...`);
  const client = await determineNpmClient(root);
  log('generalDebug_0003', `Prepare to install ${selectedPackage}@${cliVersion} using "${client}" into "${root}".`);
  progress(`Installing ${selectedPackage} ...`);
  await installPackage(client, `${selectedPackage}@${cliVersion}`, root, '--save-dev');
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

async function prepareModules(args: BaseBundleParameters) {
  if (args.optimizeModules) {
    progress('Preparing modules ...');
    await patchModules(args.root, args.ignored);
    logReset();
  }
}

export function setBundler(bundler: QualifiedBundler) {
  bundlers.push(bundler);

  if (!availableBundlers.includes(bundler.name)) {
    availableBundlers.push(bundler.name);
  }
}

export async function callPiralDebug(args: DebugPiralParameters, bundlerName?: string): Promise<Bundler> {
  const bundler = await findBundler(args.root, bundlerName);
  await prepareModules(args);
  return await bundler.actions.debugPiral.run(args).catch((err) => fail('bundlingFailed_0174', err));
}

export async function callPiletDebug(args: DebugPiletParameters, bundlerName?: string): Promise<Bundler> {
  const bundler = await findBundler(args.root, bundlerName);
  await prepareModules(args);
  return await bundler.actions.debugPilet.run(args).catch((err) => fail('bundlingFailed_0174', err));
}

export async function callPiralBuild(args: BuildPiralParameters, bundlerName?: string): Promise<BundleDetails> {
  const bundler = await findBundler(args.root, bundlerName);
  await prepareModules(args);
  return await bundler.actions.buildPiral.run(args).catch((err) => fail('bundlingFailed_0174', err));
}

export async function callPiletBuild(args: BuildPiletParameters, bundlerName?: string): Promise<BundleDetails> {
  const bundler = await findBundler(args.root, bundlerName);
  await prepareModules(args);
  return await bundler.actions.buildPilet.run(args).catch((err) => fail('bundlingFailed_0174', err));
}

export async function callDebugPiralFromMonoRepo(
  args: WatchPiralParameters,
  bundlerName?: string,
): Promise<BundleDetails> {
  const bundler = await findBundler(args.root, bundlerName);
  await prepareModules(args);
  const { bundle } = await bundler.actions.watchPiral.run(args).catch((err) => fail('bundlingFailed_0174', err));
  return bundle;
}
