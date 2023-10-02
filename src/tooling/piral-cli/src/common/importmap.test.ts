import { readImportmap } from './importmap';

jest.mock('./npm', () => ({
  tryResolvePackage(id, dir) {
    return `${dir}/${id}/index.js`;
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
};

jest.mock('./io', () => ({
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
    const deps = await readImportmap(
      '/data',
      {
        importmap: {},
      },
      false,
    );
    expect(deps).toEqual([]);
  });

  it('reads fully qualified local dependency', async () => {
    const deps = await readImportmap(
      '/data',
      {
        importmap: {
          imports: {
            'foo@1.2.3': 'foo',
          },
        },
      },
      false,
    );
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
    const deps = await readImportmap(
      '/data',
      {
        importmap: {
          imports: {
            foo: 'foo',
          },
        },
      },
      false,
    );
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
      false,
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
        requireId: 'foo@1.x',
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
      false,
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
        requireId: 'foo@1.2.x',
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
      false,
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
      readImportmap(
        '/data',
        {
          importmap: {
            imports: {
              'bar@^2.0.0': '',
            },
          },
        },
        false,
      ),
    ).rejects.toThrow();
  });
});
