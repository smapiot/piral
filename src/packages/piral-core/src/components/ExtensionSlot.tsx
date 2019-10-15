import * as React from 'react';
import { isfunc } from 'react-arbiter';
import { useGlobalState } from '../hooks';
import { defaultRender } from '../utils';
import { ExtensionSlotProps } from '../types';

export function ExtensionSlot<T = any>({ name, render = defaultRender, empty, params }: ExtensionSlotProps<T>) {
  const extensions = useGlobalState(s => s.registry.extensions[name] || []);
  return render(
    extensions.length === 0 && isfunc(empty)
      ? [<React.Fragment key="empty">{empty()}</React.Fragment>]
      : extensions.map(({ component: Component, defaults = {} }, i) => (
          <Component
            key={`${Component.displayName || '_'}${i}`}
            params={{
              ...defaults,
              ...(params || {}),
            }}
          />
        )),
  );
}
(ExtensionSlot as React.FC<ExtensionSlotProps>).displayName = `ExtensionSlot`;
