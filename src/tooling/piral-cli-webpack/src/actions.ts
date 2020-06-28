import { callDynamic, callStatic } from './webpack';
import {
  Bundler,
  BundleDetails,
  DebugPiralParameters,
  WatchPiralParameters,
  BuildPiralParameters,
  DebugPiletParameters,
  BuildPiletParameters,
} from 'piral-cli';

export async function debugPiral(args: DebugPiralParameters): Promise<Bundler> {
  const bundler = await callDynamic('debug-piral', args);
  return bundler;
}

export async function watchPiral(args: WatchPiralParameters): Promise<Bundler> {
  const bundler = await callStatic('debug-mono-piral', args);
  return bundler;
}

export async function buildPiral(args: BuildPiralParameters): Promise<BundleDetails> {
  const bundler = await callStatic('build-piral', args);
  return bundler.bundle;
}

export async function debugPilet(args: DebugPiletParameters): Promise<Bundler> {
  const bundler = await callDynamic('debug-pilet', args);
  return bundler;
}

export async function buildPilet(args: BuildPiletParameters): Promise<BundleDetails> {
  const bundler = await callStatic('build-pilet', args);
  return bundler.bundle;
}
