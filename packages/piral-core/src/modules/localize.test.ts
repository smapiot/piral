import * as hooks from '../hooks';
import { localizeLocal, localizeGlobal } from './localize';

jest.mock('../hooks');

(hooks as any).useGlobalState = (select: any) =>
  select({
    app: {
      language: {
        selected: 'en',
        translations: {
          en: {
            hi: 'hello',
            greeting: 'Hi {{name}}, welcome back',
          },
          de: {
            hi: 'hallo',
          },
        },
      },
    },
  });

describe('Localize Module', () => {
  it('localizeLocal translates from the local translations if available', () => {
    const result = localizeLocal(
      {
        en: {
          hi: 'hiho',
        },
      },
      'hi',
    );
    expect(result).toBe('hiho');
  });

  it('localizeLocal translates from the global translations if local not available', () => {
    const result = localizeLocal(
      {
        en: {
          ho: 'hiho',
        },
      },
      'hi',
    );
    expect(result).toBe('hello');
  });

  it('localizeGlobal translates from the global translations', () => {
    const result = localizeGlobal('hi');
    expect(result).toBe('hello');
  });

  it('localizeGlobal translates with variable interpolation', () => {
    const result = localizeGlobal('greeting', { name: 'User' });
    expect(result).toBe('Hi User, welcome back');
  });

  it('localizeGlobal variable interpolation ignores non-used variables', () => {
    const result = localizeGlobal('greeting', { name: 'User', age: 99 });
    expect(result).toBe('Hi User, welcome back');
  });

  it('localizeGlobal ignores non-available variables', () => {
    const result = localizeGlobal('greeting', { nom: 'User' });
    expect(result).toBe('Hi {{name}}, welcome back');
  });

  it('localizeGlobal places missing string placeholder if not found', () => {
    const result = localizeGlobal('ho');
    expect(result).toBe('__en_ho__');
  });

  it('localizeGlobal replaces undefined variables with an empty string', () => {
    const result = localizeGlobal('greeting', { name: undefined });
    expect(result).toBe('Hi , welcome back');
  });
});
