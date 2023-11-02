import { describe, it, expect, vitest, beforeEach, afterEach } from 'vitest';
import { resolve } from 'path';
import { setStandardEnvs } from './envs';

const root = resolve(__dirname, '../../../../..');

describe('Environment Module', () => {
  const oldEnv = process.env;

  beforeEach(() => {
    vitest.resetModules();
    process.env = {};
  });

  afterEach(() => {
    process.env = oldEnv;
  });

  it('setStandardEnvs reads and sets the current package.json', () => {
    const rootPackageJson = require('../../../../../package.json');
    setStandardEnvs({ root });
    expect(process.env.BUILD_PCKG_VERSION).toBe(rootPackageJson.version);
    expect(process.env.BUILD_PCKG_NAME).toBe(rootPackageJson.name);
    expect(process.env.NODE_ENV).toBe('development');
    expect(process.env.DEBUG_PILET).toBe(undefined);
  });

  it('setStandardEnvs for a production build sets env to production', () => {
    setStandardEnvs({ production: true, root });
    expect(process.env.NODE_ENV).toBe('production');
    expect(process.env.DEBUG_PILET).toBe(undefined);
    expect(process.env.SHARED_DEPENDENCIES).toBe('');
  });

  it('setStandardEnvs respects a given pilet by setting the right env', () => {
    setStandardEnvs({ debugPilet: true, root });
    expect(process.env.DEBUG_PILET).toBe('on');
    expect(process.env.SHARED_DEPENDENCIES).toBe('');
  });

  it('setStandardEnvs concats the given dependencies', () => {
    setStandardEnvs({ dependencies: ['foo', 'bar'], root });
    expect(process.env.DEBUG_PILET).toBe(undefined);
    expect(process.env.SHARED_DEPENDENCIES).toBe('foo,bar');
  });
});
