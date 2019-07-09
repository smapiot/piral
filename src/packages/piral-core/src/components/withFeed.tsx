import * as React from 'react';
import { useFeed } from '../hooks';
import { ConnectorDetails, FeedConnectorProps } from '../types';
import { ComponentLoader, ComponentError } from './helpers';

export function withFeed<TData, TItem, TProps, TMixin = TProps>(
  Component: React.ComponentType<TProps & TMixin>,
  options: ConnectorDetails<TData, TItem>,
  select: (props: FeedConnectorProps<TData>) => TMixin = props => props as any,
) {
  const FeedView: React.FC<TProps> = props => {
    const [loaded, data, error] = useFeed(options);

    if (!loaded) {
      return <ComponentLoader />;
    } else if (data) {
      const newProps = select({ data });
      return <Component {...newProps} {...props} />;
    } else {
      return <ComponentError type="feed" error={error} />;
    }
  };
  FeedView.displayName = `FeedView_${options.id}`;

  return FeedView;
}
