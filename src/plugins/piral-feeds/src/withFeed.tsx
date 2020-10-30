import * as React from 'react';
import { PiralLoadingIndicator, PiralError } from 'piral-core';
import { useFeed } from './useFeed';
import { ConnectorDetails, FeedConnectorProps } from './types';

export function withFeed<TData, TItem, TProps>(
  Component: React.ComponentType<TProps & FeedConnectorProps<TData>>,
  options: ConnectorDetails<TData, TItem>,
) {
  const FeedView: React.FC<TProps> = (props) => {
    const [loaded, data, error] = useFeed(options);

    if (!loaded) {
      return <PiralLoadingIndicator />;
    } else if (data) {
      return <Component {...props} data={data} />;
    } else {
      return <PiralError type="feed" error={error} />;
    }
  };
  FeedView.displayName = `FeedView_${options.id}`;

  return FeedView;
}
