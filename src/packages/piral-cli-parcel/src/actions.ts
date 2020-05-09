import { callDynamic, callStatic } from './parcel';
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
  const bundler = await callDynamic('debug-piral', args.root, args);
  return bundler;
}

export async function watchPiral(args: WatchPiralParameters): Promise<Bundler> {
  const bundler = await callStatic('debug-mono-piral', args.root, args);
  return bundler;
}

export async function buildPiral(args: BuildPiralParameters): Promise<BundleDetails> {
  const bundler = await callStatic('build-piral', args.root, args);
  return bundler.bundle;
}

export async function debugPilet(args: DebugPiletParameters): Promise<Bundler> {
  const bundler = await callDynamic('debug-pilet', args.root, args);
  return bundler;
}

export async function buildPilet(args: BuildPiletParameters): Promise<BundleDetails> {
  const bundler = await callStatic('build-pilet', args.root, args);
  return bundler.bundle;
}
