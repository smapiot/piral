import { describe, it, expect } from 'vitest';
import { buildName, generateId } from './guid';

describe('Guid Utility Module', () => {
  it('buildName returns name with its prefix', () => {
    const result = buildName('Ma', 'Majd');
    expect(result).toEqual('Ma://Majd');
  });

  it('Generates two consecutive different guids', () => {
    const guid1 = generateId();
    const guid2 = generateId();
    expect(guid1).not.toBe(guid2);
  });

  it('Generates a guid with 36 characters', () => {
    const guid = generateId();
    expect(guid.length).toBe(36);
  });

  it('Generates a guid with the right structure', () => {
    const guid = generateId();
    const partLengths = guid.split('-').map((m) => m.length);
    expect(partLengths.length).toBe(5);
    expect(partLengths[0]).toBe(8);
    expect(partLengths[1]).toBe(4);
    expect(partLengths[2]).toBe(4);
    expect(partLengths[3]).toBe(4);
    expect(partLengths[4]).toBe(12);
  });
});
