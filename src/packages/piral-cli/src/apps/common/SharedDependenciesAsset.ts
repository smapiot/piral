import * as Bundler from 'parcel-bundler';
import { computeMd5 } from './hash';

class SharedDependenciesAsset extends (Bundler as any).Asset {
  private readonly content: string;

  constructor(name, options) {
    super(name, options);
    const externals = (process.env.SHARED_DEPENDENCIES || '').split(',');
    const deps = externals.map(name => `deps['${name}']=require('${name}')`);
    const code = deps.join(';');
    this.content = `module.exports=function(deps){${code}};`;
  }

  load() {}

  generate() {
    return {
      js: this.content,
    };
  }

  generateHash() {
    return Promise.resolve(computeMd5(this.content));
  }
}

module.exports = SharedDependenciesAsset;
