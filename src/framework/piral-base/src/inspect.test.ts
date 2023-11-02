/**
 * @vitest-environment jsdom
 */
import 'systemjs/dist/system.js';
import 'systemjs/dist/extras/named-register.js';

import { describe, it, expect } from 'vitest';
import { inspectPilet } from './inspect';

describe('inspect pilet module', () => {
  it('inspect of explicit v0 spec should be unknown', () => {
    const [v] = inspectPilet({
      spec: 'v0',
    } as any);
    expect(v).toBe('unknown');
  });

  it('inspect of hash in meta should be v0', () => {
    const [v] = inspectPilet({
      hash: 'foo',
    } as any);
    expect(v).toBe('v0');
  });

  it('inspect of explicit v1 spec should be unknown', () => {
    const [v] = inspectPilet({
      spec: 'v1',
    } as any);
    expect(v).toBe('unknown');
  });

  it('inspect of explicit v1 spec with requireRef should be v1', () => {
    const [v] = inspectPilet({
      spec: 'v1',
      requireRef: 'abc',
    } as any);
    expect(v).toBe('v1');
  });

  it('inspect of explicit bundle prop should be bundle', () => {
    const [v] = inspectPilet({
      bundle: 'abc',
    } as any);
    expect(v).toBe('bundle');
  });

  it('inspect of explicit v2 spec should be unknown', () => {
    const [v] = inspectPilet({
      spec: 'v2',
    } as any);
    expect(v).toBe('unknown');
  });

  it('inspect of explicit v2 spec with link should be v2', () => {
    const [v] = inspectPilet({
      spec: 'v2',
      link: 'foo',
    } as any);
    expect(v).toBe('v2');
  });
});
