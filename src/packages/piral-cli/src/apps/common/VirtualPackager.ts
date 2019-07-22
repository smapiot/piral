import * as Bundler from 'parcel-bundler';

export class VirtualPackager extends (Bundler as any).Packager {
  static shouldAddAsset() {
    return false;
  }

  setup() {}

  async addAsset() {}

  getSize() {
    return 0;
  }

  end() {}
}
