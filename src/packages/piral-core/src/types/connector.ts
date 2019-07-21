export interface FeedConnectorProps<TData> {
  /**
   * The current data from the feed.
   */
  data: TData;
}

export interface StateConnectorProps<TState, TAction> {
  /**
   * The currently available state.
   */
  state: TState;
  /**
   * The actions for changing the state.
   */
  actions: TAction;
}
