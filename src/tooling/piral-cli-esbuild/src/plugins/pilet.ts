import { BuildOptions, Plugin } from 'esbuild';
import { spawnSync } from 'child_process';
import { basename, dirname, extname, relative, resolve } from 'path';

function filename(path: string) {
  const file = basename(path);
  const ext = extname(file);
  return file.substr(0, file.length - ext.length);
}

function getEntryName(options: BuildOptions) {
  if (Array.isArray(options.entryPoints)) {
    return filename(options.entryPoints[0]);
  } else {
    return Object.keys(options.entryPoints)[0];
  }
}

export interface PiletPluginOptions {
  deps: string;
}

export const piletPlugin = (options: PiletPluginOptions): Plugin => ({
  name: 'pilet-plugin',
  setup(build) {
    const rootDir = process.cwd();
    const outFile = build.initialOptions.outfile
      ? resolve(rootDir, build.initialOptions.outfile)
      : resolve(rootDir, build.initialOptions.outdir, getEntryName(build.initialOptions) + '.js');
    const outDir = relative(rootDir, dirname(outFile));

    build.onEnd((result) => {
      if (result.errors.length === 0) {
        const configPath = resolve(__dirname, '..', '..', 'pilet-babel-config.json');
        spawnSync('npx', ['babel', outDir, '--out-dir', outDir, '--source-maps', '--config-file', configPath], {
          stdio: 'inherit',
          cwd: rootDir,
          env: {
            ...process.env,
            IMPORT_DEPS: options.deps,
          },
        });
      }
    });
  },
});
