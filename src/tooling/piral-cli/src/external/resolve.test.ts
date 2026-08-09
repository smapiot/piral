import { afterEach, describe, expect, it, vi } from 'vitest';

async function loadResolver(nodeEnv: string | undefined) {
  vi.resetModules();

  const resolveSync = vi.fn(() => '/resolved/module');
  let resolverOptions: any;
  const cachedInputFileSystemCtor = vi.fn();

  vi.doMock('enhanced-resolve', () => ({
    ResolverFactory: {
      createResolver: (options: any) => {
        resolverOptions = options;
        return {
          resolveSync,
        };
      },
    },
    CachedInputFileSystem: class MockCachedInputFileSystem {
      constructor(fs: any, duration: number) {
        cachedInputFileSystemCtor(fs, duration);
      }
    },
  }));

  vi.unstubAllEnvs();
  vi.stubEnv('NODE_ENV', nodeEnv ?? '');

  const module = await import('./resolve');

  return { ...module, resolveSync, resolverOptions, cachedInputFileSystemCtor };
}

describe('resolve module', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('uses development conditions outside production', async () => {
    const { getModulePath, resolverOptions, cachedInputFileSystemCtor } = await loadResolver('development');

    expect(cachedInputFileSystemCtor).toHaveBeenCalledOnce();
    expect(resolverOptions.conditionNames).toContain('development');
    expect(getModulePath('/root', 'pkg')).toBe('/resolved/module');
  });

  it('uses default conditions in production', async () => {
    const { getModulePath, resolverOptions, cachedInputFileSystemCtor } = await loadResolver('production');

    expect(cachedInputFileSystemCtor).toHaveBeenCalledOnce();
    expect(resolverOptions.conditionNames).toContain('default');
    expect(resolverOptions.conditionNames).not.toContain('development');
    expect(getModulePath('/root', 'pkg')).toBe('/resolved/module');
  });
});