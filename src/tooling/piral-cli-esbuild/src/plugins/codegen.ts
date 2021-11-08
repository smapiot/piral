import { Plugin } from 'esbuild';
import { dirname, resolve } from 'path';

function reloadGenerator(name: string) {
  delete require.cache[require.resolve(name)];
  return require(name);
}

export const codegenPlugin = (): Plugin => ({
  name: 'codegen-loader',
  setup(build) {
    const rootDir = process.cwd();
    const outDir = build.initialOptions.outdir
      ? resolve(rootDir, build.initialOptions.outdir)
      : dirname(resolve(rootDir, build.initialOptions.outfile));

    build.onLoad({ filter: /\.codegen$/ }, async (args) => {
      const name = args.path;
      const generator = reloadGenerator(name);
      const watchFiles = [];
      const contents = await generator.call({
        name,
        options: {
          outDir,
          rootDir,
        },
        addDependency: (file, options) => {
          watchFiles.push(file);
        },
      });
      return {
        watchFiles,
        contents,
      };
    });
  },
});
