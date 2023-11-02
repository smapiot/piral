import { describe, it, expect, vitest } from 'vitest';
import { readImportmap } from './importmap';

vitest.mock('./npm', () => ({
  tryResolvePackage(id, dir) {
    if (id === 'qxz') {
      return undefined;
    } else if (id.endsWith('package.json')) {
      return `${dir}/${id}`;
    } else {
      return `${dir}/${id}/index.js`;
    }
  },
}));

const mockPackages = {
  '/data/foo': {
    name: 'foo',
    version: '1.2.3',
  },
  '/data/bar': {
    name: 'bar',
    version: '1.0.0',
  },
  '/data/app1': {
    name: 'app1',
    version: '1.0.0',
    importmap: {
      imports: {
        'foo@1.2.3': 'foo',
      },
    },
  },
  '/data/app1/foo': {
    name: 'foo',
    version: '1.2.3',
  },
  '/data/app2': {
    name: 'app1',
    version: '1.0.0',
    importmap: {
      imports: {
        'qxz@1.0.0': '',
      },
    },
  },
};

vitest.mock('./io', () => ({
  checkIsDirectory() {},
  getHash() {},
  readJson(dir) {
    return mockPackages[dir];
  },
  findFile(dir, file) {
    return `${dir}/${file}`;
  },
  checkExists() {
    return true;
  },
}));

describe('Importmap', () => {
  it('reads empty one from package.json', async () => {
    const deps = await readImportmap('/data', {
      importmap: {},
    });
    expect(deps).toEqual([]);
  });

  it('reads fully qualified local dependency', async () => {
    const deps = await readImportmap('/data', {
      importmap: {
        imports: {
          'foo@1.2.3': 'foo',
        },
      },
    });
    expect(deps).toEqual([
      {
        alias: undefined,
        entry: '/data/foo/index.js',
        id: 'foo@1.2.3',
        isAsync: false,
        name: 'foo',
        ref: 'foo.js',
        requireId: 'foo@1.2.3',
        type: 'local',
      },
    ]);
  });

  it('reads fully qualified local dependency with implied exact version', async () => {
    const deps = await readImportmap('/data', {
      importmap: {
        imports: {
          foo: 'foo',
        },
      },
    });
    expect(deps).toEqual([
      {
        alias: undefined,
        entry: '/data/foo/index.js',
        id: 'foo@1.2.3',
        isAsync: false,
        name: 'foo',
        ref: 'foo.js',
        requireId: 'foo@1.2.3',
        type: 'local',
      },
    ]);
  });

  it('reads fully qualified local dependency with implied match major version', async () => {
    const deps = await readImportmap(
      '/data',
      {
        importmap: {
          imports: {
            foo: 'foo',
          },
        },
      },
      'match-major',
    );
    expect(deps).toEqual([
      {
        alias: undefined,
        entry: '/data/foo/index.js',
        id: 'foo@1.2.3',
        isAsync: false,
        name: 'foo',
        ref: 'foo.js',
        requireId: 'foo@^1.0.0',
        type: 'local',
      },
    ]);
  });

  it('reads fully qualified local dependency with implied match major patch', async () => {
    const deps = await readImportmap(
      '/data',
      {
        importmap: {
          imports: {
            foo: 'foo',
          },
        },
      },
      'any-patch',
    );
    expect(deps).toEqual([
      {
        alias: undefined,
        entry: '/data/foo/index.js',
        id: 'foo@1.2.3',
        isAsync: false,
        name: 'foo',
        ref: 'foo.js',
        requireId: 'foo@~1.2.0',
        type: 'local',
      },
    ]);
  });

  it('reads fully qualified local dependency with implied any match', async () => {
    const deps = await readImportmap(
      '/data',
      {
        importmap: {
          imports: {
            foo: 'foo',
          },
        },
      },
      'all',
    );
    expect(deps).toEqual([
      {
        alias: undefined,
        entry: '/data/foo/index.js',
        id: 'foo@1.2.3',
        isAsync: false,
        name: 'foo',
        ref: 'foo.js',
        requireId: 'foo@*',
        type: 'local',
      },
    ]);
  });

  it('fails when the local version does not match the desired version', async () => {
    await expect(
      readImportmap('/data', {
        importmap: {
          imports: {
            'bar@^2.0.0': '',
          },
        },
      }),
    ).rejects.toThrow();
  });

  it('fails when the explicitly shared package is not installed', async () => {
    await expect(
      readImportmap('/data', {
        importmap: {
          imports: {
            qxz: '',
          },
        },
      }),
    ).rejects.toThrow();
  });

  it('accepts an importmap with valid resolvable inherited deps', async () => {
    const deps = await readImportmap('/data', {
      importmap: {
        imports: {},
        inherit: ['app1'],
      },
    });
    expect(deps).toEqual([
      {
        alias: undefined,
        entry: '/data/app1/foo/index.js',
        id: 'foo@1.2.3',
        isAsync: false,
        name: 'foo',
        ref: 'foo.js',
        requireId: 'foo@1.2.3',
        type: 'local',
        parents: ['app1'],
      },
    ]);
  });

  it('accepts an importmap with valid but unresolvable inherited deps', async () => {
    const deps = await readImportmap('/data', {
      importmap: {
        imports: {},
        inherit: ['app2'],
      },
    });
    expect(deps).toEqual([]);
  });
});
