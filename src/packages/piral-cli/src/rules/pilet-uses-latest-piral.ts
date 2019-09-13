import { PiletRuleContext } from '../types';

export function piletUsesLatestPiral(this: PiletRuleContext) {
  const { name, version } = this.data.appPackage;
  const dependencies = {
    ...this.peerDependencies,
    ...this.dependencies,
    ...this.devDependencies,
  };
  const versionSelector = dependencies[name];

}
