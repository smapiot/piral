const patchMap: Record<string, (rootDir: string) => Promise<void>> = {};

export function getPatch(packageName: string) {
  return patchMap[packageName];
}

export function installPatch(packageName: string, patch: (rootDir: string) => Promise<void>) {
  if (packageName in patchMap) {
    const newPatch = patch;
    const oldPatch = patchMap[packageName];
    patch = (rootDir) => oldPatch(rootDir).then(() => newPatch(rootDir));
  }

  patchMap[packageName] = patch;
}
