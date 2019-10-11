import * as React from 'react';
import { ComponentLoader, ComponentError } from 'piral-core';
import { useFeed } from './useFeed';
import { ConnectorDetails, FeedConnectorProps } from './types';

export function withFeed<TData, TItem, TProps>(
  Component: React.ComponentType<TProps & FeedConnectorProps<TData>>,
  options: ConnectorDetails<TData, TItem>,
) {
  const FeedView: React.FC<TProps> = props => {
    const [loaded, data, error] = useFeed(options);

    if (!loaded) {
      return <ComponentLoader />;
    } else if (data) {
      return <Component data={data} {...props} />;
    } else {
      return <ComponentError type="feed" error={error} />;
    }
  };
  FeedView.displayName = `FeedView_${options.id}`;

  return FeedView;
}
