export function getPackageName() {
  return process.env.BUILD_PCKG_NAME;
}

export function getRequireRef() {
  const name = getPackageName();
  return `esbuildpr_${name.replace(/\W/gi, '')}`;
}
