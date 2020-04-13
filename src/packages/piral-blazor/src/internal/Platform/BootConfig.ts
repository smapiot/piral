export interface BootJsonData {
  entryAssembly: string;
  resources: ResourceGroups;
  debugBuild: boolean;
  linkerEnabled: boolean;
  cacheBootResources: boolean;
  config: Array<string>;
}

export interface ResourceGroups {
  assembly: ResourceList;
  pdb?: ResourceList;
  runtime: ResourceList;
  satelliteResources?: Record<string, ResourceList>;
}

export type ResourceList = Record<string, string>;

export class BootConfigResult {
  constructor(public bootConfig: BootJsonData, public applicationEnvironment = 'Production') {}
}

let testAnchor: HTMLAnchorElement;

export function toAbsoluteUri(relativeUri: string) {
  testAnchor = testAnchor || document.createElement('a');
  testAnchor.href = relativeUri;
  return testAnchor.href;
}
