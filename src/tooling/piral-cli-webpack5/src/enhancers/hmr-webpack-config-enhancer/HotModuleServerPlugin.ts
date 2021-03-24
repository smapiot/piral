import { Compiler, WebpackPluginInstance } from 'webpack';

export class HotModuleServerPlugin implements WebpackPluginInstance {
  constructor(private hmrPort: number) {}

  apply(compiler: Compiler) {
    const express = require('express');
    const app = express();
    app.use(require('../../../src/webpack-hot-middleware/middleware')(compiler));
    app.listen(this.hmrPort, () => {});
  }
}
