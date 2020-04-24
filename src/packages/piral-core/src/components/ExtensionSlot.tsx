import * as React from 'react';
import { isfunc } from 'piral-base';
import { useGlobalState } from '../hooks';
import { defaultRender } from '../utils';
import { ExtensionSlotProps } from '../types';

export function ExtensionSlot<T extends string>({
  name,
  render = defaultRender,
  empty,
  params,
}: ExtensionSlotProps<T>) {
  const extensions = useGlobalState(s => s.registry.extensions[name] || []);
  return render(
    extensions.length === 0 && isfunc(empty)
      ? [defaultRender(empty(), 'empty')]
      : extensions.map(({ component: Component, reference, defaults = {} }, i) => (
          <Component
            key={`${reference?.displayName || '_'}${i}`}
            params={{
              ...defaults,
              ...(params || {}),
            }}
          />
        )),
  );
}

ExtensionSlot.displayName = `ExtensionSlot`;
