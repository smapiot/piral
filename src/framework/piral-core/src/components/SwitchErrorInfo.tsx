import * as React from 'react';
import { useGlobalState } from '../hooks';
import { defaultRender, none } from '../utils';
import { ErrorComponentsState, Errors, ErrorInfoProps } from '../types';

function renderComponent<TKey extends keyof ErrorComponentsState>(
  components: ErrorComponentsState,
  props: Errors[TKey],
) {
  const name = props.type;
  const Component = components[name];

  if (process.env.NODE_ENV === 'development') {
    React.useEffect(() => console.error('[dev-info] An error occurred in the Piral instance.', props), none);
  }

  if (!Component) {
    const Unknown = components.unknown;

    if (Unknown) {
      return <Unknown {...(props as any)} type="unknown" />;
    }

    return defaultRender(`Error: ${props.type}`);
  }

  return <Component {...(props as any)} />;
}

export const SwitchErrorInfo: React.FC<ErrorInfoProps> = (props) => {
  const components = useGlobalState((m) => m.errorComponents);
  return renderComponent(components, props);
};
