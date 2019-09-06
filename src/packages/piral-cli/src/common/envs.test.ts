import { setStandardEnvs } from './envs';

describe('Environment Module', () => {
  const oldEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {};
  });

  afterEach(() => {
    process.env = oldEnv;
  });

  it('setStandardEnvs reads and sets the current package.json', async () => {
    const rootPackageJson = require('../../../../../package.json');
    await setStandardEnvs();
    expect(process.env.BUILD_PCKG_VERSION).toBe(rootPackageJson.version);
    expect(process.env.BUILD_PCKG_NAME).toBe(rootPackageJson.name);
    expect(process.env.NODE_ENV).toBe('development');
    expect(process.env.DEBUG_PILET).toBeUndefined();
  });

  it('setStandardEnvs for a production build sets env to production', async () => {
    await setStandardEnvs({ production: true });
    expect(process.env.NODE_ENV).toBe('production');
    expect(process.env.DEBUG_PILET).toBeUndefined();
    expect(process.env.SHARED_DEPENDENCIES).toBeUndefined();
  });

  it('setStandardEnvs respects a given pilet by setting the right env', async () => {
    await setStandardEnvs({ pilet: 'foo' });
    expect(process.env.DEBUG_PILET).toBe('foo');
    expect(process.env.SHARED_DEPENDENCIES).toBeUndefined();
  });

  it('setStandardEnvs concats the given dependencies', async () => {
    await setStandardEnvs({ dependencies: ['foo', 'bar'] });
    expect(process.env.DEBUG_PILET).toBeUndefined();
    expect(process.env.SHARED_DEPENDENCIES).toBe('foo,bar');
  });
});
