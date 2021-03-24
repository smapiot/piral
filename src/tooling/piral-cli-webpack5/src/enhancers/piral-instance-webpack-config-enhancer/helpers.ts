export function getVariables(
  name: string,
  version: string,
  externals: Array<string>,
  env: string,
): Record<string, boolean | string> {
  return {
    NODE_ENV: env,
    BUILD_TIME: new Date().toDateString(),
    BUILD_TIME_FULL: new Date().toISOString(),
    BUILD_PCKG_VERSION: version,
    BUILD_PCKG_NAME: name,
    SHARED_DEPENDENCIES: externals.join(','),
    DEBUG_PIRAL: '',
    DEBUG_PILET: '',
  };
}

export function setEnvironment(variables: Record<string, boolean | string>) {
  Object.keys(variables).forEach((key) => (process.env[key] = String(variables[key])));
}

export function getDefineVariables(variables: Record<string, boolean | string>) {
  return Object.entries(variables).reduce((obj, [name, value]) => {
    obj[`process.env.${name}`] = JSON.stringify(value);
    return obj;
  }, {});
}
