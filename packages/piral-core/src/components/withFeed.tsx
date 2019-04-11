import * as React from 'react';
import { useFeed } from '../hooks';
import { ConnectorDetails, ConnectorProps } from '../types';
import { ComponentLoader, ComponentError } from './helpers';

export function withFeed<TData, TItem, TProps>(
  Component: React.ComponentType<TProps & ConnectorProps<TData>>,
  options: ConnectorDetails<TData, TItem>,
) {
  const FeedView: React.SFC<TProps> = props => {
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
