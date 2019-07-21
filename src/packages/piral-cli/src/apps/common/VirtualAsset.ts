import * as Bundler from 'parcel-bundler';
import { computeMd5 } from './hash';

class VirtualAsset extends (Bundler as any).Asset {
  private readonly content: string;

  constructor(name, options) {
    super(name, options);
    const refName = name.substr(1).replace(/\.vm$/, '');
    this.content = `module.exports=require('${refName}');`;
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

export = VirtualAsset;
