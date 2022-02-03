import * as React from 'react';
import { isfunc } from 'piral-base';
import { wrapComponent } from './wrapComponent';
import { useGlobalState, useGlobalStateContext } from '../hooks';
import { defaultRender, none } from '../utils';
import { ExtensionRegistration, ExtensionSlotProps } from '../types';

const renderExtensions: [ExtensionRegistration] = [
  {
    component: (props) => {
      const context = useGlobalStateContext();
      const converters = context.converters;
      const piral = context.apis._;
      const { component, props: args } = props.params;
      const Component = React.useMemo(
        () => wrapComponent(converters, component, { piral }, defaultRender),
        [component],
      );
      return <Component {...args} />;
    },
    defaults: {},
    pilet: '',
    reference: {
      displayName: 'RenderExtension',
    },
  },
];

/**
 * The extension slot component to be used when the available
 * extensions of a given name should be rendered at a specific
 * location.
 */
export function ExtensionSlot<T extends string>(props: ExtensionSlotProps<T>) {
  const { name, render = defaultRender, empty, params, children } = props;
  const extensions = useGlobalState((s) => (name ? s.registry.extensions[name] || none : renderExtensions));
  return render(
    extensions.length === 0 && isfunc(empty)
      ? [defaultRender(empty(), 'empty')]
      : extensions.map(({ component: Component, reference, defaults = {} }, i) => (
          <Component
            key={`${reference?.displayName || '_'}${i}`}
            children={children}
            params={{
              ...defaults,
              ...(params || {}),
            }}
          />
        )),
  );
}

ExtensionSlot.displayName = `ExtensionSlot`;
