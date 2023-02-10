import * as React from 'react';
import { useGlobalState } from 'piral-core';

export interface TrackerProps {}

/**
 * The tracker component. Integrate this in a layout
 * where all the registered trackers should be active / running.
 */
export const Tracker: React.FC<TrackerProps> = () => {
  const trackers = useGlobalState((m) => m.registry.trackers);

  return (
    <>
      {Object.keys(trackers).map((m) => {
        const Tracker = trackers[m].component;
        return <Tracker key={m} />;
      })}
    </>
  );
};
Tracker.displayName = 'Tracker';
