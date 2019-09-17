import { swap, Atom, deref } from '@dbeining/react-atom';
import { GlobalState, withKey, withoutKey } from 'piral-core';
import { ConnectorDetails, FeedReducer } from './types';

export function createFeed(ctx: Atom<GlobalState>, id: string) {
  swap(ctx, state => ({
    ...state,
    feeds: withKey(state.feeds, id, {
      data: undefined,
      error: undefined,
      loaded: false,
      loading: false,
    }),
  }));
}

export function destroyFeed(ctx: Atom<GlobalState>, id: string) {
  swap(ctx, state => ({
    ...state,
    feeds: withoutKey(state.feeds, id),
  }));
}

export function loadFeed<TData, TItem>(ctx: Atom<GlobalState>, options: ConnectorDetails<TData, TItem>) {
  const { id } = options;

  swap(ctx, state => ({
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
      loadedFeed(ctx, id, baseData, undefined);

      options.connect(item => {
        updateFeed(ctx, id, item, options.update);
      });
    },
    err => loadedFeed(ctx, id, undefined, err),
  );
}

export function loadedFeed(ctx: Atom<GlobalState>, id: string, data: any, error: any) {
  swap(ctx, state => ({
    ...state,
    feeds: withKey(state.feeds, id, {
      loading: false,
      loaded: true,
      error,
      data,
    }),
  }));
}

export function updateFeed<TData, TItem>(
  ctx: Atom<GlobalState>,
  id: string,
  item: TItem,
  reducer: FeedReducer<TData, TItem>,
) {
  const feed = deref(ctx).feeds[id];
  const result = reducer(feed.data, item);

  if (result instanceof Promise) {
    return result
      .then(data => loadedFeed(ctx, id, data, undefined))
      .catch(error => loadedFeed(ctx, id, undefined, error));
  } else if (result !== feed.data) {
    loadedFeed(ctx, id, result, undefined);
  }
}
