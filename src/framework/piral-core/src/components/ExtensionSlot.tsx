import * as React from 'react';
import { isfunc } from 'piral-base';
import { useGlobalState } from '../hooks';
import { defaultRender } from '../utils';
import { ExtensionSlotProps } from '../types';

/**
 * The extension slot component to be used when the available
 * extensions of a given name should be rendered at a specific
 * location.
 */
export function ExtensionSlot<T extends string>(props: ExtensionSlotProps<T>) {
  const { name, render = defaultRender, empty, params } = props;
  const extensions = useGlobalState((s) => s.registry.extensions[name] || []);
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
