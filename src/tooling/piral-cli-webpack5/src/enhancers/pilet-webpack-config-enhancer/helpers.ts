export function getVariables(name: string, version: string, env: string): Record<string, string> {
  return {
    NODE_ENV: env,
    BUILD_TIME: new Date().toDateString(),
    BUILD_TIME_FULL: new Date().toISOString(),
    BUILD_PCKG_VERSION: version,
    BUILD_PCKG_NAME: name,
  };
}

export function setEnvironment(variables: Record<string, string>) {
  Object.keys(variables).forEach(key => (process.env[key] = variables[key]));
}

export function getDefineVariables(variables: Record<string, string>) {
  return Object.entries(variables).reduce((obj, [name, value]) => {
    obj[`process.env.${name}`] = JSON.stringify(value);
    return obj;
  }, {});
}
