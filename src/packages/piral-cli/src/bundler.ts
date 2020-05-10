import { installPackage, cliVersion, fail, progress, log, determineNpmClient } from './common';
import {
  Bundler,
  BundleDetails,
  DebugPiralParameters,
  BuildPiletParameters,
  BuildPiralParameters,
  WatchPiralParameters,
  DebugPiletParameters,
  BundlerDefinition,
} from './types';

export interface QualifiedBundler {
  name: string;
  actions: BundlerDefinition;
}

const bundlers: Array<QualifiedBundler> = [];

async function installDefaultBundler(root: string) {
  const parcel = 'piral-cli-parcel';

  try {
    log('generalDebug_0003', `Trying to resolve ${parcel}.`);
    require(parcel);
  } catch {
    log('generalDebug_0003', `Determining NPM client at "${root}" ...`);
    const client = await determineNpmClient(root);
    log('generalDebug_0003', `Prepare to install ${parcel}@${cliVersion} using "${client}" into "${root}".`);
    progress(`Installing ${parcel} ...`);
    await installPackage(client, `${parcel}@${cliVersion}`, root, '--save-dev');
    log('generalDebug_0003', 'Installed bundler.');
  }

  require('./inject').inject(parcel);
}

async function findBundler(root: string, bundlerName?: string) {
  const [defaultBundler] = bundlers;

  if (bundlerName) {
    const [bundler] = bundlers.filter(m => m.name === bundlerName);

    if (!bundler) {
      fail(
        'bundlerMissing_0072',
        bundlerName,
        bundlers.map(b => b.name),
      );
    }

    return bundler;
  } else if (!defaultBundler) {
    await installDefaultBundler(root);
    return bundlers[0];
  } else {
    return defaultBundler;
  }
}

export function setBundler(bundler: QualifiedBundler) {
  bundlers.push(bundler);
}

export async function callPiralDebug(args: DebugPiralParameters, bundlerName?: string): Promise<Bundler> {
  const bundler = await findBundler(args.root, bundlerName);
  return await bundler.actions.debugPiral(args);
}

export async function callPiletDebug(args: DebugPiletParameters, bundlerName?: string): Promise<Bundler> {
  const bundler = await findBundler(args.root, bundlerName);
  return await bundler.actions.debugPilet(args);
}

export async function callPiralBuild(args: BuildPiralParameters, bundlerName?: string): Promise<BundleDetails> {
  const bundler = await findBundler(args.root, bundlerName);
  return await bundler.actions.buildPiral(args);
}

export async function callPiletBuild(args: BuildPiletParameters, bundlerName?: string): Promise<BundleDetails> {
  const bundler = await findBundler(args.root, bundlerName);
  return await bundler.actions.buildPilet(args);
}

export async function callDebugPiralFromMonoRepo(
  args: WatchPiralParameters,
  bundlerName?: string,
): Promise<BundleDetails> {
  const bundler = await findBundler(args.root, bundlerName);
  const { bundle } = await bundler.actions.watchPiral(args);
  return bundle;
}
