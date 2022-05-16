import * as React from 'react';
import { isfunc } from 'piral-base';
import { wrapComponent } from './wrapComponent';
import { useGlobalState, useGlobalStateContext } from '../hooks';
import { defaultRender, none } from '../utils';
import { ExtensionRegistration, ExtensionSlotProps } from '../types';

const wrapper = ({ children }) => defaultRender(children);

const renderExtensions: [ExtensionRegistration] = [
  {
    component: (props) => {
      const context = useGlobalStateContext();
      const converters = context.converters;
      const piral = context.apis._;
      const { component, props: args } = props.params;
      const Component = React.useMemo(() => wrapComponent(converters, component, { piral }, wrapper), [component]);
      return <Component {...args} />;
    },
    defaults: {},
    pilet: '',
    reference: {
      displayName: 'AnyComponent',
    },
  },
];

function defaultOrder(extensions: Array<ExtensionRegistration>) {
  return extensions;
}

/**
 * The extension slot component to be used when the available
 * extensions of a given name should be rendered at a specific
 * location.
 */
export function ExtensionSlot<T extends string>(props: ExtensionSlotProps<T>) {
  const {
    name,
    render = defaultRender,
    empty,
    params,
    children,
    emptySkipsRender = false,
    order = defaultOrder,
  } = props;
  const extensions = useGlobalState((s) => (name ? s.registry.extensions[name] || none : renderExtensions));
  const isEmpty = extensions.length === 0 && isfunc(empty);
  const content = isEmpty
    ? [defaultRender(empty(), 'empty')]
    : order(extensions).map(({ component: Component, reference, defaults = {} }, i) => (
        <Component
          key={`${reference?.displayName || '_'}${i}`}
          children={children}
          params={{
            ...defaults,
            ...params,
          }}
        />
      ));

  if (isEmpty && emptySkipsRender) {
    return content[0];
  }

  return render(content);
}

ExtensionSlot.displayName = `ExtensionSlot`;
