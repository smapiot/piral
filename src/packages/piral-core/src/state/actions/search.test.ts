import { Atom, deref } from '@dbeining/react-atom';
import { appendSearchResults, prependSearchResults, resetSearchResults, setSearchInput } from './search';

describe('Search Action Module', () => {
  it('appendSearchResults cont appends new items with still loading', () => {
    const state = Atom.of({
      foo: 5,
      search: {
        input: 'yo',
        loading: true,
        results: ['c'],
      },
    });
    appendSearchResults.call(state, ['a', 'b'], false);
    expect(deref(state)).toEqual({
      foo: 5,
      search: {
        input: 'yo',
        loading: true,
        results: ['c', 'a', 'b'],
      },
    });
  });

  it('appendSearchResults stop appends new items without still loading', () => {
    const state = Atom.of({
      foo: [1, 2],
      search: {
        input: 'yo',
        loading: true,
        results: ['c'],
      },
    });
    appendSearchResults.call(state, ['a'], true);
    expect(deref(state)).toEqual({
      foo: [1, 2],
      search: {
        input: 'yo',
        loading: false,
        results: ['c', 'a'],
      },
    });
  });

  it('prependSearchResults cont prepends new items with still loading', () => {
    const state = Atom.of({
      foo: 5,
      search: {
        input: 'yo',
        loading: true,
        results: ['c'],
      },
    });
    prependSearchResults.call(state, ['a', 'b'], false);
    expect(deref(state)).toEqual({
      foo: 5,
      search: {
        input: 'yo',
        loading: true,
        results: ['a', 'b', 'c'],
      },
    });
  });

  it('prependSearchResults stop prepends new items without still loading', () => {
    const state = Atom.of({
      foo: [1, 2],
      search: {
        input: 'yo',
        loading: true,
        results: ['c'],
      },
    });
    prependSearchResults.call(state, ['a'], true);
    expect(deref(state)).toEqual({
      foo: [1, 2],
      search: {
        input: 'yo',
        loading: false,
        results: ['a', 'c'],
      },
    });
  });

  it('resetSearchResults cont resets the search results while still loading', () => {
    const state = Atom.of({
      foo: [1, 2],
      search: {
        input: 'yo',
        loading: true,
        results: ['c'],
      },
    });
    resetSearchResults.call(state, true);
    expect(deref(state)).toEqual({
      foo: [1, 2],
      search: {
        input: 'yo',
        loading: true,
        results: [],
      },
    });
  });

  it('resetSearchResults stop resets the search results without loading', () => {
    const state = Atom.of({
      foo: 5,
      search: {
        input: 'yo y',
        loading: true,
        results: ['c'],
      },
    });
    resetSearchResults.call(state, false);
    expect(deref(state)).toEqual({
      foo: 5,
      search: {
        input: 'yo y',
        loading: false,
        results: [],
      },
    });
  });

  it('setSearchInput sets the input field accordingly', () => {
    const state = Atom.of({
      foo: 5,
      search: {
        input: 'yo y',
        loading: true,
        results: ['c'],
      },
    });
    setSearchInput.call(state, 'test input');
    expect(deref(state)).toEqual({
      foo: 5,
      search: {
        input: 'test input',
        loading: true,
        results: ['c'],
      },
    });
  });
});
