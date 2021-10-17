import { Plugin, Compiler } from 'webpack';

export class HotModuleServerPlugin implements Plugin {
  constructor(private hmrPort: number) {}

  apply(compiler: Compiler) {
    const express = require('express');
    const app = express();
    app.use(require('webpack-hot-middleware')(compiler));
    app.listen(this.hmrPort, () => {});
  }
}
