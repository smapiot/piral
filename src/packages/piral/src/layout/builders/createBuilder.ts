export function createBuilder<TBuilder, TState>(
  builder: TBuilder,
  state: TState,
  next: (state: TState) => TBuilder,
): TBuilder {
  Object.keys(state).forEach(key => {
    builder[key] = Component =>
      next({
        ...state,
        [key]: Component,
      });
  });
  return builder;
}
