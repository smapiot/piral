import { useDynamicLanguage, useTranslate } from './hooks';

jest.mock('piral-core', () => ({
  useActions() {
    return {
      translate() {
        return 'mock';
      },
    };
  },
  useGlobalState() {
    // do nothing
  },
}));

jest.mock('react', () => ({
  useEffect() {},
  useState(initial) {
    return [initial, () => {}];
  },
}));

describe('Piral-Translate hooks module', () => {
  it('uses the translate action underneath', () => {
    const translate = useTranslate();
    const result = translate('');
    expect(result).toBe('mock');
  });

  it('reads the current language', () => {
    const [current, setCurrent] = useDynamicLanguage('de', () => Promise.resolve({ global: {}, locals: [] }));
    expect(current).toBe('de');
  });

  it('allows switching to a remote language', () => {
    const [current, setCurrent] = useDynamicLanguage('de', () => Promise.resolve({ global: {}, locals: [] }));
    expect(typeof setCurrent).toBe('function');
  });
});
