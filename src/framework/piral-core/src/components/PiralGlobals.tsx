import * as React from 'react';
import { PortalRenderer } from './PortalRenderer';
import { RegisteredDebug } from './components';

/**
 * Integrates the global portal renderer and the debug utilities
 * (if registered).
 */
export const PiralGlobals: React.FC = () => {
  return (
    <>
      <PortalRenderer id="root" />
      <RegisteredDebug />
    </>
  );
};
