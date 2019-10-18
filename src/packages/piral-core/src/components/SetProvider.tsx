import * as React from 'react';
import { useAction } from '../hooks';

export interface SetProviderProps {
  /**
   * The provider to register.
   */
  provider: JSX.Element;
}

export function SetProvider({ provider }: SetProviderProps): React.ReactElement {
  const includeProvider = useAction('includeProvider');
  React.useEffect(() => provider && includeProvider(provider), []);
  // tslint:disable-next-line:no-null-keyword
  return null;
}
