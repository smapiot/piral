import { swap, Atom, deref } from '@dbeining/react-atom';
import { withKey, withoutKey } from '../../utils';
import { GlobalState, ConnectorDetails, FeedReducer } from '../../types';

export function createFeed(id: string) {
  swap(this as Atom<GlobalState>, state => ({
    ...state,
    feeds: withKey(state.feeds, id, {
      data: undefined,
      error: undefined,
      loaded: false,
      loading: false,
    }),
  }));
}

export function destroyFeed(id: string) {
  swap(this as Atom<GlobalState>, state => ({
    ...state,
    feeds: withoutKey(state.feeds, id),
  }));
}

export function loadFeed<TData, TItem>(options: ConnectorDetails<TData, TItem>) {
  const { id } = options;
  const globalState = this as Atom<GlobalState>;

  swap(globalState, state => ({
    ...state,
    feeds: withKey(state.feeds, id, {
      data: undefined,
      error: undefined,
      loaded: false,
      loading: true,
    }),
  }));

  return options.initialize().then(
    baseData => {
      loadedFeed.call(globalState, id, baseData, undefined);

      options.connect(item => {
        updateFeed.call(globalState, id, item, options.update);
      });
    },
    err => loadedFeed.call(globalState, id, undefined, err),
  );
}

export function loadedFeed(id: string, data: any, error: any) {
  swap(this as Atom<GlobalState>, state => ({
    ...state,
    feeds: withKey(state.feeds, id, {
      loading: false,
      loaded: true,
      error,
      data,
    }),
  }));
}

export function updateFeed<TData, TItem>(id: string, item: TItem, reducer: FeedReducer<TData, TItem>) {
  const globalState = this as Atom<GlobalState>;
  const feed = deref(globalState).feeds[id];
  const result = reducer(feed.data, item);

  if (result instanceof Promise) {
    result
      .then(data => loadedFeed.call(globalState, id, data, undefined))
      .catch(error => loadedFeed.call(globalState, id, undefined, error));
  } else if (result !== feed.data) {
    loadedFeed.call(globalState, id, result, undefined);
  }
}
