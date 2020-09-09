import * as React from 'react';
import { LoadingIndicatorProps } from '../types';

/**
 * The default loading indicator only displaying "Loading".
 */
export const DefaultLoadingIndicator: React.FC<LoadingIndicatorProps> = () => <div>Loading</div>;
DefaultLoadingIndicator.displayName = 'DefaultLoadingIndicator';
