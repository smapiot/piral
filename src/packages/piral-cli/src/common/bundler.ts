const bundleWithCodegen = require('parcel-plugin-codegen');

export function extendBundlerWithPlugins(bundler: any) {
  bundleWithCodegen(bundler);
}
