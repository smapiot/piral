import * as React from 'react';
import { useFeed, useGlobalState } from '../hooks';
import { ConnectorDetails, ConnectorProps } from '../types';

export function withFeed<TData, TItem, TProps>(
  Component: React.ComponentType<TProps & ConnectorProps<TData>>,
  options: ConnectorDetails<TData, TItem>,
) {
  const FeedView: React.SFC<TProps> = props => {
    const { Loader, ErrorInfo } = useGlobalState(s => s.app.components);
    const [loaded, data, error] = useFeed(options);

    if (!loaded) {
      return <Loader />;
    } else if (data) {
      return <Component data={data} {...props} />;
    } else {
      return <ErrorInfo type="feed" error={error} />;
    }
  };
  FeedView.displayName = `FeedView_${options.id}`;

  return FeedView;
}
