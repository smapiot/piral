import { swap, Atom } from '@dbeining/react-atom';
import { GlobalState, SearchProviderRegistration } from '../../types';
import { withKey, withoutKey } from '../../utils';

export function registerSearchProvider(name: string, value: SearchProviderRegistration) {
  swap(this as Atom<GlobalState>, state => ({
    ...state,
    search: {
      ...state.search,
      providers: withKey(state.search.providers, name, value),
    },
  }));
}

export function unregisterSearchProvider(name: string) {
  swap(this as Atom<GlobalState>, state => ({
    ...state,
    search: {
      ...state.search,
      providers: withoutKey(state.search.providers, name),
    },
  }));
}
