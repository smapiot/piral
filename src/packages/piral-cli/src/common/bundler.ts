import {
  Bundler,
  BundleDetails,
  DebugPiralParameters,
  BuildPiletParameters,
  BuildPiralParameters,
  WatchPiralParameters,
  DebugPiletParameters,
} from '../types';

export async function callPiralDebug(args: DebugPiralParameters): Promise<Bundler> {
  return undefined;
}

export async function callPiletDebug(args: DebugPiletParameters): Promise<Bundler> {
  return undefined;
}

export async function callDebugPiralFromMonoRepo(args: WatchPiralParameters): Promise<BundleDetails> {
  return undefined;
}

export async function callPiralBuild(args: BuildPiralParameters): Promise<BundleDetails> {
  return undefined;
}

export async function callPiletBuild(args: BuildPiletParameters): Promise<BundleDetails> {
  return undefined;
}
