import { withKey, withoutKey, GlobalStateContext } from 'piral-core';
import { ConnectorDetails, FeedReducer } from './types';

export function createFeed(ctx: GlobalStateContext, id: string) {
  ctx.dispatch((state) => ({
    ...state,
    feeds: withKey(state.feeds, id, {
      data: undefined,
      error: undefined,
      loaded: false,
      loading: false,
    }),
  }));
}

export function destroyFeed(ctx: GlobalStateContext, id: string) {
  ctx.dispatch((state) => ({
    ...state,
    feeds: withoutKey(state.feeds, id),
  }));
}

export function loadFeed<TData, TItem>(ctx: GlobalStateContext, options: ConnectorDetails<TData, TItem>) {
  const { id } = options;

  ctx.dispatch((state) => ({
    ...state,
    feeds: withKey(state.feeds, id, {
      data: undefined,
      error: undefined,
      loaded: false,
      loading: true,
    }),
  }));

  return options.initialize().then(
    (baseData) => {
      loadedFeed(ctx, id, baseData, undefined);

      options.dispose = options.connect((item) => {
        updateFeed(ctx, id, item, options.update);
      });
    },
    (err) => loadedFeed(ctx, id, undefined, err),
  );
}

export function loadedFeed(ctx: GlobalStateContext, id: string, data: any, error: any) {
  ctx.dispatch((state) => ({
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
  ctx: GlobalStateContext,
  id: string,
  item: TItem,
  reducer: FeedReducer<TData, TItem>,
) {
  const feed = ctx.readState((state) => state.feeds[id]);
  const result = reducer(feed.data, item);

  if (result instanceof Promise) {
    return result
      .then((data) => loadedFeed(ctx, id, data, undefined))
      .catch((error) => loadedFeed(ctx, id, undefined, error));
  } else if (result !== feed.data) {
    loadedFeed(ctx, id, result, undefined);
  }
}
