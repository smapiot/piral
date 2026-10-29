import { describe, expect, it } from 'vitest';
import { getDependencyExternals, getIdentifiers } from './codegen';

const root = process.cwd();

describe('codegen dependencies', () => {
  it('registers Angular core public secondary entry points from the shared shell graph', () => {
    expect(getDependencyExternals(['react', '@angular/core'])).toEqual([
      'react',
      '@angular/core',
      '@angular/core/rxjs-interop',
      '@angular/core/primitives/di',
      '@angular/core/primitives/signals',
    ]);
  });

  it('does not duplicate explicitly configured Angular secondary entry points', () => {
    expect(getDependencyExternals(['@angular/core', '@angular/core/rxjs-interop'])).toEqual([
      '@angular/core',
      '@angular/core/rxjs-interop',
      '@angular/core/primitives/di',
      '@angular/core/primitives/signals',
    ]);
  });

  it('does not add Angular dependencies when core is not shared', () => {
    const externals = ['react', '@angular/common'];

    expect(getDependencyExternals(externals)).toBe(externals);
  });

  it('does not register a secondary Angular entry point under the core identifier', () => {
    expect(getIdentifiers(root, '@angular/core/rxjs-interop')).not.toContainEqual(expect.stringMatching(/^@angular\/core@/));
  });
});