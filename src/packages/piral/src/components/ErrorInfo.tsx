import * as React from 'react';
import { ExtensionSlot, ErrorInfoProps, useGlobalState, ComponentsState, defaultRender } from 'piral-core';

type ComponentsProps<T> = T extends React.ComponentType<infer U> ? U : never;

function renderComponent<TKey extends keyof ComponentsState>(
  components: ComponentsState,
  name: TKey,
  props: ComponentsProps<ComponentsState[TKey]>,
) {
  const Component = components[name];

  if (!Component) {
    return defaultRender(undefined);
  }

  return <Component {...(props as any)} />;
}

const ErrorInfo: React.FC<ErrorInfoProps> = props => {
  const components = useGlobalState(m => m.components);

  switch (props.type) {
    case 'not_found':
      return renderComponent(components, 'NotFoundErrorInfo', props);
    case 'page':
      return renderComponent(components, 'PageErrorInfo', props);
    case 'tile':
      return renderComponent(components, 'TileErrorInfo', props);
    case 'menu':
      return renderComponent(components, 'MenuErrorInfo', props);
    case 'extension':
      return renderComponent(components, 'ExtensionErrorInfo', props);
    case 'modal':
      return renderComponent(components, 'ModalErrorInfo', props);
    case 'loading':
      return renderComponent(components, 'LoadingErrorInfo', props);
    case 'feed':
      return renderComponent(components, 'FeedErrorInfo', props);
    case 'form':
      return renderComponent(components, 'FormErrorInfo', props);
    default:
      return renderComponent(components, 'UnknownErrorInfo', props);
  }
};

export const SwitchErrorInfo: React.FC<ErrorInfoProps> = props => (
  <>
    <ErrorInfo {...props} />
    <ExtensionSlot name={`error_${props.type}`} params={props} />
  </>
);
