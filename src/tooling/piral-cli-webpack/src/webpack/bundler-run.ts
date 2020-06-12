import * as webpack from 'webpack';

interface BuildResult {
  outFile: string;
  outDir: string;
}

export function runWebpack(wpConfig: webpack.Configuration) {
  const bundle = () => new Promise<BuildResult>((resolve, reject) => {
    webpack(wpConfig, (err, stats) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        console.log(
          stats.toString({
            chunks: false,
            colors: true,
            usedExports: true,
          }),
        );

        if (stats.hasErrors()) {
          reject(stats.toJson());
        } else {
          resolve({
            outFile: '',
            outDir: '',
          });
        }
      }
    });
  });

  // Event Names: buildStart, bundled


  return {
    bundle,
    on() {},
    off() {},
    options: {
      outDir: '',
    },
    mainBundle: {
      name: '',
      entryAsset: {
        hash: '',
      },
    },
  };
}
