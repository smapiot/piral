import * as React from 'react';
import { LoaderProps } from '../../types';

export const DefaultLoader: React.FC<LoaderProps> = () => <div>Loading</div>;
DefaultLoader.displayName = 'DefaultLoader';
