import { mkdtempSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { execSync } from 'child_process';
import { join, resolve } from 'path';
import { tmpdir } from 'os';
import { buildPiral } from './build-piral';
import { setBundler } from '../bundler';

const twoMinutes = 2 * 60 * 1000;

const defaultPackageJson = (files: Array<any>) => `
  {
    "name": "piral-local-test",
    "version": "1.0.0",
    "description": "",
    "keywords": [
      "piral"
    ],
    "dependencies": {
      "piral": "*"
    },
    "scripts": {
      "start": "piral debug",
      "build": "piral build"
    },
    "app": "./src/index.html",
    "pilets": {
      "files": ${JSON.stringify(files)},
      "externals": [],
      "scripts": {
        "build": "npm run build-pilet",
        "start": "npm run debug-pilet"
      },
      "validators": {},
      "devDependencies": {},
      "preScaffold": "",
      "postScaffold": "",
      "preUpgrade": "",
      "postUpgrade": ""
    },
    "devDependencies": {
      "@types/node": "latest",
      "@types/react": "latest",
      "@types/react-dom": "latest",
      "@types/react-router": "latest",
      "@types/react-router-dom": "latest",
      "piral-cli": "*",
      "typescript": "latest"
    }
  }
`;

const defaultIndexHtml = `
  <!DOCTYPE html>
  <html lang="en">
  <meta charset="UTF-8">
  <title>Test Piral Instance</title>
  <div id="app"></div>
  <script src="./index.tsx"></script>
  </html>
`;

const defaultIndexTsx = `
  import { renderInstance } from 'piral';

  renderInstance({
    requestPilets() {
      return Promise.resolve([]);
    },
  });
`;

const tsConfigJson = `
  {
    "compilerOptions": {
      "declaration": true,
      "target": "es6",
      "sourceMap": true,
      "outDir": "./lib",
      "skipLibCheck": true,
      "lib": ["dom", "es2018"],
      "moduleResolution": "node",
      "module": "esnext",
      "jsx": "react",
      "importHelpers": true
    },
    "include": [
      "./src"
    ],
    "exclude": [
      "node_modules"
    ]
  }
`;

function createTempDir() {
  return mkdtempSync(join(tmpdir(), 'piral-tests-build-piral-'));
}

function scaffoldNewPiralInstance(files: Array<any> = []) {
  const dir = createTempDir();

  mkdirSync(resolve(dir, 'src'));
  console.log('Created temporary directory ...', dir);

  writeFileSync(resolve(dir, 'package.json'), defaultPackageJson(files), 'utf8');
  writeFileSync(resolve(dir, 'tsconfig.json'), tsConfigJson, 'utf8');
  writeFileSync(resolve(dir, 'src/index.html'), defaultIndexHtml, 'utf8');
  writeFileSync(resolve(dir, 'src/index.tsx'), defaultIndexTsx, 'utf8');

  execSync('npm i', {
    cwd: dir,
  });

  return dir;
}

describe('Build Piral Command', () => {
  beforeEach(() => {
    setBundler({
      name: 'parcel',
      actions: require(resolve(__dirname, '../../../piral-cli-parcel/lib/actions')),
    });
  });

  it('missing source should result in an error', async () => {
    const dir = createTempDir();
    let error = false;

    try {
      await buildPiral(dir);
    } catch {
      error = true;
    }

    expect(error).toBeTruthy();
  });

  it(
    'can create an emulator build without files in default subdir',
    async () => {
      const dir = scaffoldNewPiralInstance();
      let error = false;

      try {
        await buildPiral(dir, {
          type: 'emulator',
        });
      } catch {
        error = true;
      }

      expect(error).toBeFalsy();
      expect(existsSync(resolve(dir, 'dist/emulator/piral-local-test-1.0.0.tgz'))).toBeTruthy();
      expect(existsSync(resolve(dir, 'dist/piral-local-test-1.0.0.tgz'))).toBeFalsy();
      expect(existsSync(resolve(dir, 'dist/release'))).toBeFalsy();
      expect(existsSync(resolve(dir, 'dist/index.html'))).toBeFalsy();
    },
    twoMinutes,
  );

  it(
    'can create an emulator build without files in explicit subdir',
    async () => {
      const dir = scaffoldNewPiralInstance();
      let error = false;

      try {
        await buildPiral(dir, {
          type: 'emulator',
          subdir: true,
        });
      } catch {
        error = true;
      }

      expect(error).toBeFalsy();
      expect(existsSync(resolve(dir, 'dist/emulator/piral-local-test-1.0.0.tgz'))).toBeTruthy();
      expect(existsSync(resolve(dir, 'dist/piral-local-test-1.0.0.tgz'))).toBeFalsy();
      expect(existsSync(resolve(dir, 'dist/release'))).toBeFalsy();
      expect(existsSync(resolve(dir, 'dist/index.html'))).toBeFalsy();
    },
    twoMinutes,
  );

  it(
    'can create an emulator build without files in no subdir',
    async () => {
      const dir = scaffoldNewPiralInstance();
      let error = false;

      try {
        await buildPiral(dir, {
          type: 'emulator',
          subdir: false,
        });
      } catch {
        error = true;
      }

      expect(error).toBeFalsy();
      expect(existsSync(resolve(dir, 'dist/emulator/piral-local-test-1.0.0.tgz'))).toBeFalsy();
      expect(existsSync(resolve(dir, 'dist/piral-local-test-1.0.0.tgz'))).toBeTruthy();
      expect(existsSync(resolve(dir, 'dist/release'))).toBeFalsy();
      expect(existsSync(resolve(dir, 'dist/index.html'))).toBeFalsy();
    },
    twoMinutes,
  );

  it(
    'can create a release build in implicit subdir',
    async () => {
      const dir = scaffoldNewPiralInstance();
      let error = false;

      try {
        await buildPiral(dir, {
          type: 'release',
        });
      } catch {
        error = true;
      }

      expect(error).toBeFalsy();
      expect(existsSync(resolve(dir, 'dist/emulator/piral-local-test-1.0.0.tgz'))).toBeFalsy();
      expect(existsSync(resolve(dir, 'dist/piral-local-test-1.0.0.tgz'))).toBeFalsy();
      expect(existsSync(resolve(dir, 'dist/release/index.html'))).toBeTruthy();
      expect(existsSync(resolve(dir, 'dist/index.html'))).toBeFalsy();
    },
    twoMinutes,
  );

  it(
    'can create a release build in explicit subdir',
    async () => {
      const dir = scaffoldNewPiralInstance();
      let error = false;

      try {
        await buildPiral(dir, {
          type: 'release',
          subdir: true,
        });
      } catch {
        error = true;
      }

      expect(error).toBeFalsy();
      expect(existsSync(resolve(dir, 'dist/emulator/piral-local-test-1.0.0.tgz'))).toBeFalsy();
      expect(existsSync(resolve(dir, 'dist/piral-local-test-1.0.0.tgz'))).toBeFalsy();
      expect(existsSync(resolve(dir, 'dist/release/index.html'))).toBeTruthy();
      expect(existsSync(resolve(dir, 'dist/index.html'))).toBeFalsy();
    },
    twoMinutes,
  );

  it(
    'can create a release build in no subdir',
    async () => {
      const dir = scaffoldNewPiralInstance();
      let error = false;

      try {
        await buildPiral(dir, {
          type: 'release',
          subdir: false,
        });
      } catch {
        error = true;
      }

      expect(error).toBeFalsy();
      expect(existsSync(resolve(dir, 'dist/emulator/piral-local-test-1.0.0.tgz'))).toBeFalsy();
      expect(existsSync(resolve(dir, 'dist/piral-local-test-1.0.0.tgz'))).toBeFalsy();
      expect(existsSync(resolve(dir, 'dist/release/index.html'))).toBeFalsy();
      expect(existsSync(resolve(dir, 'dist/index.html'))).toBeTruthy();
    },
    twoMinutes,
  );

  it(
    'can create all builds with files',
    async () => {
      const dir = scaffoldNewPiralInstance([
        'foo.txt',
        {
          from: 'src/bar.txt',
          to: 'bar.txt',
        },
      ]);
      writeFileSync(resolve(dir, 'foo.txt'), 'foo!', 'utf8');
      writeFileSync(resolve(dir, 'src/bar.txt'), 'bar!', 'utf8');
      let error = false;

      try {
        await buildPiral(dir);
      } catch {
        error = true;
      }

      expect(error).toBeFalsy();
      expect(existsSync(resolve(dir, 'dist/emulator/piral-local-test-1.0.0.tgz'))).toBeTruthy();
      expect(existsSync(resolve(dir, 'dist/release'))).toBeTruthy();
    },
    twoMinutes,
  );
});
