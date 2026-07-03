import * as fs from 'graceful-fs';
import { ResolverFactory, CachedInputFileSystem } from 'enhanced-resolve';

const nodeFileSystem = new CachedInputFileSystem(fs, 100);

const nodeContext = {
  environments: ['node+es3+es5+process+native'],
};

const enhancedResolve = ResolverFactory.createResolver({
  aliasFields: ['browser'],
  conditionNames: ['import', 'module', 'webpack', 'development', 'browser'],
  extensions: ['.js', '.jsx', '.mjs', '.ts', '.tsx', '.json'],
  exportsFields: ['exports'],
  importsFields: ['imports'],
  mainFields: ['browser', 'module', 'main'],
  useSyncFileSystemCalls: true,
  fileSystem: nodeFileSystem,
});

export function getModulePath(root: string, moduleName: string) {
  const res = enhancedResolve.resolveSync(nodeContext, root, moduleName);

  if (!res) {
    throw new Error(`Could not find module "${moduleName}".`);
  }

  return res;
}
