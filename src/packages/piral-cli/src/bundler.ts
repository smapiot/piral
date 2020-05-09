import { resolve } from 'path';
import { installPackage, cliVersion, fail } from './common';
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

async function installDefaultBundler() {
  const parcel = 'piral-cli-parcel';

  try {
    require(parcel);
  } catch {
    const location = resolve(__dirname, '..');
    await installPackage('npm', `${parcel}@${cliVersion}`, location, '--no-save', '--no-package-lock');
  }

  require('./inject').inject(parcel);
}

export function setBundler(bundler: QualifiedBundler) {
  bundlers.push(bundler);
}

export async function getBundler(bundlerName?: string) {
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
    await installDefaultBundler();
    return bundlers[0];
  } else {
    return defaultBundler;
  }
}

export async function callPiralDebug(args: DebugPiralParameters, bundlerName?: string): Promise<Bundler> {
  const bundler = await getBundler(bundlerName);
  return await bundler.actions.debugPiral(args);
}

export async function callPiletDebug(args: DebugPiletParameters, bundlerName?: string): Promise<Bundler> {
  const bundler = await getBundler(bundlerName);
  return await bundler.actions.debugPilet(args);
}

export async function callPiralBuild(args: BuildPiralParameters, bundlerName?: string): Promise<BundleDetails> {
  const bundler = await getBundler(bundlerName);
  return await bundler.actions.buildPiral(args);
}

export async function callPiletBuild(args: BuildPiletParameters, bundlerName?: string): Promise<BundleDetails> {
  const bundler = await getBundler(bundlerName);
  return await bundler.actions.buildPilet(args);
}

export async function callDebugPiralFromMonoRepo(
  args: WatchPiralParameters,
  bundlerName?: string,
): Promise<BundleDetails> {
  const bundler = await getBundler(bundlerName);
  const { bundle } = await bundler.actions.watchPiral(args);
  return bundle;
}
