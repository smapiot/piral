import { describe, it, expect, vitest, beforeEach } from 'vitest';
import rule from './pilet-has-externals-as-peers';
import { PiletRuleContext } from '../types';

const fileTemplate = (prefix: string) => `
import '${prefix}-1';
import "${prefix}-2";
import foo, { bar } from '${prefix}-3';

require('${prefix}-4');
require("${prefix}-5");
`;

const usedExternalPrefixesToFail = ['hello', 'world', '@hello/world'];
const usedExternalPrefixes = [...usedExternalPrefixesToFail, 'hello/world', '@hello/world/goo'];
const usedExternalsToFail = usedExternalPrefixesToFail
  .map((prefix) => [`${prefix}-1`, `${prefix}-2`, `${prefix}-3`, `${prefix}-4`, `${prefix}-5`])
  .reduce((acc, val) => acc.concat(val), []);

vitest.mock('../common', async () => ({
  ...((await vitest.importActual('../common')) as any),
  getSourceFiles() {
    return usedExternalPrefixes.map((prefix) => ({
      read() {
        return Promise.resolve(fileTemplate(prefix));
      },
    }));
  },
}));

describe('Rule pilet-has-externals-as-peers', () => {
  const error = vitest.fn();
  const peerDependencies = {
    foo: '*',
    bar: '*',
    '@foo/bar': '*',
  };
  const peerModules = ['foo/sub', '@foo/bar/sub'];

  function createContext(externals: string[]): PiletRuleContext {
    return {
      apps: [
        {
          appPackage: {
            pilets: {
              externals,
            },
          },
        },
      ],
      piletPackage: {},
      peerDependencies,
      peerModules,
      entry: 'test-entry',
      error,
    } as any;
  }

  const peerExternals = [...Object.keys(peerDependencies), 'foo/sub', '@foo/bar/sub'];
  const moreExternals = [...peerExternals, 'foo-bar', 'foo-bar/sub', '@foo-bar/2k', '@foo-bar/2k/sub'];
  const contextNotMissingExternals = createContext(peerExternals);
  const contextMissingExternals = createContext(moreExternals);

  beforeEach(() => {
    error.mockReset();
  });

  describe('option not passed', () => {
    it('does not report errors', async () => {
      await rule(contextNotMissingExternals);
      await rule(contextMissingExternals);
      expect(error).not.toHaveBeenCalled();
    });
  });

  describe('option=ignore', () => {
    it('does not report errors', async () => {
      await rule(contextNotMissingExternals, 'ignore');
      await rule(contextMissingExternals, 'ignore');
      expect(error).not.toHaveBeenCalled();
    });
  });

  describe('option=active', () => {
    it('does not report errors if no externals are missing', async () => {
      await rule(contextNotMissingExternals, 'active');
      expect(error).not.toHaveBeenCalled();
    });

    it('reports error if externals are missing', async () => {
      await rule(contextMissingExternals, 'active');
      expect(error).toHaveBeenCalled();
    });
  });

  describe('option=only-used', () => {
    it('does not report errors if none of the missing externals are used', async () => {
      await rule(createContext([...peerExternals, 'nope']), 'only-used');
      expect(error).not.toHaveBeenCalled();
    });

    it.each(usedExternalsToFail.map((external) => [external]))(
      'reports error if the missing external "%s" is used',
      async (external) => {
        await rule(createContext([...peerExternals, external]), 'only-used');
        expect(error).toHaveBeenCalled();
      },
    );
  });
});
