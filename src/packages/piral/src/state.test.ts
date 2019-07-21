import { mergeStates } from './state';

describe('Merge State Module', () => {
  it('should merge two non-intersecting states', () => {
    const state = mergeStates(
      {
        app: {
          loading: true,
        },
      },
      {
        user: {
          features: {
            foo: true,
            bar: false,
          },
        },
      },
    );

    expect(state).toEqual({
      app: {
        loading: true,
      },
      user: {
        features: {
          foo: true,
          bar: false,
        },
      },
    });
  });

  it('should merge two intersecting states', () => {
    const state = mergeStates(
      {
        app: {
          loading: true,
        },
        user: {
          features: {
            foo: true,
          },
        },
      },
      {
        app: {
          language: {
            selected: 'en',
            available: [],
          },
        },
        user: {
          features: {
            bar: false,
          },
        },
      },
    );

    expect(state).toEqual({
      app: {
        loading: true,
        language: {
          selected: 'en',
          available: [],
        },
      },
      user: {
        features: {
          foo: true,
          bar: false,
        },
      },
    });
  });

  it('should override by the latter', () => {
    const state = mergeStates(
      {
        app: {
          loading: true,
        },
      },
      {
        app: {
          loading: false,
        },
      },
    );

    expect(state).toEqual({
      app: {
        loading: false,
      },
    });
  });

  it('ignores undefined states', () => {
    const state = mergeStates(
      {
        app: {
          loading: true,
        },
      },
      undefined
    );

    expect(state).toEqual({
      app: {
        loading: true,
      },
    });
  });
});
