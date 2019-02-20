import * as React from 'react';
import { useEffect } from 'react';
import { useGlobalState, useAction } from '../hooks';
import { ConnectorDetails } from '../types';

export function withFeed<TData, TItem, TProps>(
  Component: React.ComponentType<TProps & { data: TData }>,
  options: ConnectorDetails<TData, TItem>,
) {
  const FeedView: React.SFC<TProps> = ({ ...props }) => {
    const { loaded, loading, error, data } = useGlobalState(s => s.feeds[options.id]);
    const { Loader, ErrorInfo } = useGlobalState(s => s.app.components);
    const load = useAction('loadFeed');

    useEffect(() => {
      if (!loaded && !loading) {
        load(options);
      }
    }, []);

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
