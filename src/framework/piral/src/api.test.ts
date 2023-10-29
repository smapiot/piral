import { describe, it, expect } from 'vitest';
import { extendPiralApi } from './api';

describe('Piral api module', () => {
  it('extendPiralApi without arguments just includes standard ones', () => {
    const api = extendPiralApi();
    expect(api.length).toBe(6);
  });

  it('extendPiralApi with an empty array just includes standard ones', () => {
    const api = extendPiralApi(undefined, []);
    expect(api.length).toBe(6);
  });

  it('extendPiralApi with a some entries mixes standard ones with custom APIs', () => {
    const api = extendPiralApi(undefined, [() => undefined, () => undefined]);
    expect(api.length).toBe(8);
  });
});
