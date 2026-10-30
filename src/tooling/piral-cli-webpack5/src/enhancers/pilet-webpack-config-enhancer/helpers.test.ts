import { describe, expect, it } from 'vitest';
import type { SharedDependency } from 'piral-cli';
import type { Configuration } from 'webpack';
import { getDependencies } from './helpers';

function dependency(name: string, version = '22.1.6'): SharedDependency {
  return {
    entry: `/fixtures/${name.replace(/[^a-z]/gi, '-')}.mjs`,
    id: `${name}@${version}`,
    name,
    ref: `${name.replace(/[^a-z]/gi, '-')}.js`,
    requireId: `${name}@^22.0.0`,
    type: 'local',
  };
}

function compiler(): Configuration {
  return {
    entry: {},
    externals: [{}],
  };
}

describe('getDependencies', () => {
  it('creates a separate entry for every local dependency', () => {
    const core = dependency('@angular/core');
    const interop = dependency('@angular/core/rxjs-interop');
    const signals = dependency('@angular/core/primitives/signals');
    const config = compiler();

    expect(getDependencies([core, interop, signals], config)).toEqual({
      [core.id]: core.ref,
      [interop.id]: interop.ref,
      [signals.id]: signals.ref,
    });
    expect(config.entry).toEqual({
      [core.ref.replace(/\.js$/, '')]: core.entry,
      [interop.ref.replace(/\.js$/, '')]: interop.entry,
      [signals.ref.replace(/\.js$/, '')]: signals.entry,
    });
    expect(config.externals).toEqual([
      {
        [core.name]: core.requireId,
        [interop.name]: interop.requireId,
        [signals.name]: signals.requireId,
      },
    ]);
  });

  it('keeps different dependency versions in their own entries', () => {
    const core = dependency('@angular/core', '22.1.6');
    const interop = dependency('@angular/core/rxjs-interop', '21.2.22');
    const config = compiler();

    getDependencies([core, interop], config);

    expect(config.entry).toEqual({
      [core.ref.replace(/\.js$/, '')]: core.entry,
      [interop.ref.replace(/\.js$/, '')]: interop.entry,
    });
  });

  it('retains unrelated local dependencies', () => {
    const core = dependency('@angular/core');
    const lodash = dependency('lodash');
    const config = compiler();

    getDependencies([core, lodash], config);

    expect(config.entry).toEqual({
      [core.ref.replace(/\.js$/, '')]: core.entry,
      [lodash.ref.replace(/\.js$/, '')]: lodash.entry,
    });
  });
});