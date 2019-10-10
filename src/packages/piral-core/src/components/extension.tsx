import * as React from 'react';
import { isfunc } from 'react-arbiter';
import { useGlobalState } from '../hooks';
import { ExtensionSlotProps } from '../types';

function defaultRender(items: Array<React.ReactNode>) {
  return <>{items}</>;
}

export function ExtensionSlot<T = any>({ name, render = defaultRender, empty, params }: ExtensionSlotProps<T>) {
  const extensions = useGlobalState(s => s.components.extensions[name] || []);
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
